import path from 'path'
import express from 'express'
import cors from 'cors'
import cookie from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import template from './../index.js'
import devBundle from './devBundle'
import chat from './routes/chat.routes'
import http from 'http'
import socketIo from 'socket.io'
import { query } from './base-datos/conexion'
const app = express();
devBundle.compile(app)
app.set('port', 3000);
app.use(morgan('dev'));
app.use(cors(
{
  origin: [
    'http://e6e4187872e9.ngrok.io/'
  ]
}
))
app.use(cookie())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
require('dotenv').config({ path: '.env' })

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.use('/', chat)

app.get('*', (req, res) => {
  res.status(200).send(template())
})

const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: "http://e6e4187872e9.ngrok.io",
    methods: ["GET", "POST"],
  }
})

io.on("connection", (socket) => {
 let room;

 socket.on('create', (roomname) => {
   room = roomname
   socket.join(room)
   console.log(socket.rooms)
 })

 socket.on("message", (msg) => {
   io.to(room).emit("message", msg);  
   console.log(msg)

   const parametros = [room]
   const sql = "SELECT idChat FROM ChatStorage WHERE ChatName = ?"
   query(sql, parametros)
   .then((rows) => {
    if(rows.length){
      const data =`,{"user": "${msg.user}", "message": "${msg.message}"}]}`
      const parametros = [data]
      const sql = `update ChatStorage set ChatData = concat(substring_index(ChatData, "]", 1), ?)`

      query(sql, parametros)
      .then((rows) => {
	console.log(rows)
      }).catch(e => console.error(e))

    }else{
      const date = new Date(); 
      let data = {"ChatData": [msg]}
      let string = JSON.stringify(data)
      const parametros = [room, string, date]
      const sql = "INSERT INTO ChatStorage (ChatName, ChatData, fecha) VALUES (?, ?, ?)"
   	query(sql, parametros)
   	.then((rows) => {
	  console.log(rows)
	}).catch(e => console.error(e))
    }

   })
   })

  socket.on("typing", (user) =>{
    socket.to(room).broadcast.emit("typing", user)
  })

  socket.on("NoTyping", () => {
    socket.to(room).emit("NoTyping")
  })

})




const appl = server.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`)
})



