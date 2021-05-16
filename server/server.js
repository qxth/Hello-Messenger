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
import redisAdapter from "socket.io-redis";
import Redis from "ioredis";
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
io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

io.on("connection", (socket) => {
  let room, idFriend, idUser;
  socket.on("online", async (id) => {
    redis
      .pipeline()
      .set(`status_${id}`, "online")
      .set(`dataInit_${id}`, `{"id": ${id}, "socketID": "${socket.id}"}`)
      .exec((err, res) => {
        if (err) return console.log(err);
        console.log(res);
        idUser = id;
      });
  });
  socket.on("checkOnline", async (id) => {
    redis.get(`status_${id.id}`, (err, res) => {
      if (err) return console.log(err);
      console.log("===================");
      console.log(`${id.nickname}:${res}`);
      console.log("===================");
      if (res == "online")
        return socket.emit("checkOnline", {
          status: "green",
          nickname: id.nickname,
        });
      socket.emit("checkOnline", { status: "red", nickname: id.nickname });
    });
  });
  socket.on("newMessage", async (data) => {
    const parametros = [data.id, idUser, data.id, idUser],
      sql =
        "SELECT idChat FROM ChatStorage WHERE (idFriend=? AND idUser=?) OR (idUser=? AND idFriend=?)",
      res = await query(sql, parametros);
    const num = await redis.get(`notify_${res[0].idChat}_${data.id}`);
    socket.emit("newMessage", {
      id: data.id,
      nickname: data.name,
      notify: num,
    });
    console.log(
      `notify of ${data.name}_${data.id}:${num} in room ${res[0].idChat} loading..`
    );
  });
  socket.on("updateService", async (id) => {
    redis.get(`dataInit_${id}`, (err, res) => {
      if (err) return console.error(err);
      const json = JSON.parse(res);
      console.log("====data=====");
      console.log(json);
      io.to(`${json.socketID}`).emit("updateService");
      console.log("====data=====");
    });
  });
  socket.on("create", async (roomname) => {
    if (room !== undefined) {
      console.log(`leaving room.. ${room}`);
      socket.leave(room);
    }
    (room = roomname.room), (idFriend = roomname.id);
    socket.join([room]);
    redis.set(`notify_${room}_${idFriend}`, 0);
    console.log(roomname);
    console.log(socket.rooms);
  });
  socket.on("leaveRoom", () => {
    if (room !== undefined) {
      socket.leave(room);
      console.log(room);
      console.log("leaving the room...");
      console.log(socket.rooms);
    }
  });
  socket.on("checkRoom", async () => {
    const roomId = await io.in(room).allSockets(),
      res = await redis.get(`dataInit_${idFriend}`),
      json = JSON.parse(res);
    console.log("friendID:", idFriend);
    console.log("myid:", idUser);
    if (!roomId.has(json.socketID)) {
      socket.leave(room);
      const num = await redis.get(`notify_${room}_${idUser}`);
      console.log(num);
      if (isNaN(num)) {
        redis.set(`notify_${room}_${idUser}`, 1);
        console.log("num null");
        console.log("sending notify...", json.socketID);
        socket
          .to(`${json.socketID}`)
          .emit("checkRoom", { notify: 1, id: idUser });
        socket.join([room]);
        console.log(socket.rooms);
      } else {
        redis.set(`notify_${room}_${idUser}`, parseInt(num) + 1);
        console.log("sending notify...", json.socketID);
        socket
          .to(`${json.socketID}`)
          .emit("checkRoom", { notify: parseInt(num) + 1, id: idUser });
        socket.join([room]);
        console.log(socket.rooms);
      }
    }
  });
  socket.on("message", async (resMsg) => {
    const msg = JSON.parse(resMsg);
    io.to(room).emit("message", msg);
    console.log(msg);
    const data = `,${resMsg}]}`,
      parametros = [data, room],
      sql = `update ChatStorage set ChatData = concat(substring_index(ChatData, "]", 1), ?) WHERE idChat=?`;
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
      .exec((err, res) => {
        if (err) return console.log(err);
        console.log(res);
      });
  });
});

const appl = server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
