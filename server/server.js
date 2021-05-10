import path from "path";
import express from "express";
import cors from "cors";
import cookie from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import template from "./../index.js";
import devBundle from "./devBundle";
import chat from "./routes/chat.routes";
import http from "http";
import socketIo from "socket.io";
import permisoLogin from "./auth/permisoLogin";
import { query } from "./base-datos/conexion";
import authLogin from "./auth/authLogin";
import user from "./routes/user.routes";
import authVerify from "./auth/authVerify";
import fetch from "node-fetch";
import routerApi from "./utils/routes-api";
import redisAdapter from 'socket.io-redis';
import Redis from 'ioredis';
const redis = new Redis();
const app = express();
devBundle.compile(app);
app.set("port", 3000);
app.use(permisoLogin.initialize());

app.use(morgan("dev"));
/*app.use(cors(
{
  origin: [
    'http://e6e4187872e9.ngrok.io/'
  ]
}
))
*/
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config({ path: ".env" });

const CURRENT_WORKING_DIR = process.cwd();
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

app.use("/", chat);
app.use("/", user);
app.use("/", authVerify);
app.use("/", authLogin);

app.get("*", (req, res) => {
  res.status(200).send(template());
});

const server = http.createServer(app);

const io = socketIo(server);
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on("connection", (socket) => {
  let room, idFriend, idUser;
  socket.on("online", async (id) => {
    redis
    .pipeline()
    .set(`status_${id}`, "online")
    .set(`dataInit_${id}`, `{"id": ${id}, "socketID": "${socket.id}"}`)
    .exec((err, res) => {
      if(err) return console.log(err);
      console.log(res)
      idUser = id
    });
  });
  socket.on("checkOnline", async(id) => {
    redis.get(`status_${id.id}`, (err, res) => {
      if(err) return console.log(err)
      console.log("===================")
      console.log(`${id.nickname}:${res}`)
      console.log("===================")
      if(res == "online") return socket.emit("checkOnline", {status: "green", nickname: id.nickname});
      socket.emit("checkOnline", {status: "red", nickname: id.nickname})
    })
  })
  socket.on("updateService", async(id) => {
    redis.get(`dataInit_${id}`, (err, res) => {
      if(err) return console.error(err);
      const json = JSON.parse(res)
      console.log("====data=====")
      console.log(json)
      io.to(`${json.socketID}`).emit("updateService")
      console.log("====data=====")

    })
  })
  socket.on("create", (roomname) => {
    (room = roomname.room), (idFriend = roomname.id);
    socket.join([room]);
    console.log(roomname);
  });
  socket.on("message", async (msg) => {
    io.to(room).emit("message", msg);
    console.log(msg);
    console.log(idFriend);
    const data = `,{"user": "${msg.user}", "message": "${
      msg.message
    }", "date": "${new Date()}"}]}`;
    const parametros = [data, room];
    const sql = `update ChatStorage set ChatData = concat(substring_index(ChatData, "]", 1), ?) WHERE idChat=?`;
    await query(sql, parametros);
  });

  socket.on("typing", (user) => {
    socket.to(room).broadcast.emit("typing", user);
  });

  socket.on("NoTyping", () => {
    socket.to(room).emit("NoTyping");
  });

  socket.on("disconnect", async (reason) => {
    redis
    .pipeline()
    .set(`status_${idUser}`, "offline")
    .del(`dataInit_${idUser}`)
    .exec((err, res) => {
      if(err) return console.log(err)
        console.log(res)
    })
  });
});

const appl = server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
