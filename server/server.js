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
/*
io.engine.generateId = (req) => {
  fetch(`http://localhost:3000${routerApi.verificarToken}`, {
    method: "GET"
  }).then(res => res.json())
  .then(data => {
    console.log("================")
    console.log(data)
    console.log("======================")
    return data.data.id;
  })
}
*/

io.on("connection", (socket) => {
  let room;
  let idFriend;
  const con = [];
  socket.on("online", async (id) => {
    con.push(id);
    console.log(con);
    const parametros = ["#00FF00", id];
    const sql = `update UserData set Status =?  WHERE id=?`;
    await query(sql, parametros);
  });
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
    const parametros = ["red", con[0]];
    const sql = `update UserData set Status =? WHERE id=?`;
    await query(sql, parametros);
  });
});

const appl = server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
