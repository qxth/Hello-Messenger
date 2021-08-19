import {Logger, UseGuards, Req} from '@nestjs/common'
import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection, 
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from "ioredis";
import {AuthGuard} from '@nestjs/passport'
import {Request} from 'express'
import {SocketGuard} from './guards/socketAuth.guard'
import { Chat } from './../entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, Brackets} from 'typeorm';

interface Notify{
  status?: any;
  id?: any;
  nickname:any;
  notify?: any;
}
@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private readonly logger = new Logger('AppGateway')
  idUser: any;
  idFriend: any;
  redis: any;
  room: any;
  friendsOrderSocket: any;
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>
  ){
    this.idUser = "";
    this.redis = new Redis()
    this.room = ""
    this.idFriend = ""
    this.friendsOrderSocket = (idF: any) => {
    this.redis.get(`friendsOrder_${idF}`, (err, data) => {
      if (err) return console.error(err);
      if (JSON.stringify(data) === "null") 
          return this.redis.set(`friendsOrder_${idF}`, JSON.stringify([{ id: this.idUser }]));
        console.log("updating in another chat my local chat");
        console.log("data", data);
        console.log("MyId:", this.idUser);
        const arrFriend = JSON.parse(data),
          newArr = Array.from(arrFriend),
          posEl = arrFriend.findIndex((e) => e.id === this.idUser);
        console.log(posEl);
        if (posEl !== -1) {
          newArr.splice(posEl, 1);
          newArr.unshift(arrFriend[posEl]);
          console.log("ifarr", newArr)
          return this.redis.set(`friendsOrder_${idF}`, JSON.stringify(newArr));
        } 
          newArr.unshift({ id: this.idUser });
          this.redis.set(`friendsOrder_${idF}`, JSON.stringify(newArr));
          console.log("notifarr", newArr)
    });
  };
  }
  afterInit(server: Server){
    this.logger.log('Socket initialized')
  }
	@WebSocketServer()
	server: Server;	
  //@UseGuards(SocketGuard)
  @SubscribeMessage("online")
  public online(@MessageBody() id: any, @ConnectedSocket() client: Socket): any{
    console.log(client.id)
    this.redis
    .pipeline()
    .set(`status_${id}`, "online")
    .set(`dataInit_${id}`, `{"id": ${id}, "socketID": "${client.id}"}`)
    .exec((err, res) => {
      if(err) return console.log(err);
      this.idUser = id;
      console.log(res)
    })
  }
  @SubscribeMessage("checkOnline")
  checkOnline(@MessageBody() id: any, @ConnectedSocket() client: Socket): any{
    this.redis.get(`status_${id.id}`, (err, res) => {
      if (err) return console.log(err);
      const notifyLog:  Notify  = {
        status: "green",
        nickname: id.nickname
      }
      if (res !== "online")
        notifyLog.status = "red"
      return client.emit("checkOnline", notifyLog);
    });
  }
  @SubscribeMessage("newMessage")
  async newMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any>{
  const rows = await this.chatRepository
    .createQueryBuilder("ChatStorage")
    .select(['idChat'])
    .where({idFriend: data.id})
    .andWhere({idUser: this.idUser})
    .orWhere(new Brackets (qb => {
      qb.where({idFriend: this.idUser})
      .andWhere({idUser: data.id})
    }))
    .getRawMany()
    const numNotifys: any = await this.redis.get(`notify_${rows[0].idChat}_${data.id}`);
    const newNotify: Notify = {
      id: data.id,
      nickname: data.name,
      notify: numNotifys
    } 
    console.log(
      `notify of ${data.name}_${data.id}:${numNotifys} in room ${rows[0].idChat} loading..`
    );
    return client.emit("newMessage", newNotify)
  }
  @SubscribeMessage("updateService")
  updateService(@MessageBody() id: any){
    this.redis.get(`dataInit_${id}`, (err, res) => {
      if (err) return console.error(err);
      const json = JSON.parse(res);
      console.log("====data=====");
      console.log(json);
      this.server.to(`${json.socketID}`).emit("updateService");
      console.log("====data=====");
    });
  }
  @SubscribeMessage("create")
  create(@MessageBody() roomname: any, @ConnectedSocket() client: Socket){
    if (this.room !== undefined) {
      console.log(`leaving room.. ${this.room}`);
      client.leave(this.room);
    }
    (this.room = roomname.room), (this.idFriend = roomname.id);
    client.join([this.room]);
    this.redis.set(`notify_${this.room}_${this.idFriend}`, 0);
    console.log(roomname);
    console.log(client.rooms);
  }
  @SubscribeMessage("leaveRoom")
  leaveRoom(client: Socket){
    if (this.room !== undefined) {
      client.leave(this.room);
      console.log(this.room);
      console.log("leaving the room...");
      console.log(client.rooms);
    }
  }
  @SubscribeMessage("checkRoom")
  async checkRoom(client: Socket): Promise<any>{
    const roomId = await this.server.in(this.room).allSockets(),
      res = await this.redis.get(`dataInit_${this.idFriend}`),
      json = JSON.parse(res);
    console.log("checking room");
    this.friendsOrderSocket(this.idFriend);
    console.log("friendID:", this.idFriend);
    console.log("myid:", this.idUser);
    console.log("has id?", roomId.has(json.socketID))
    console.log("room", this.room)
    if (!roomId.has(json.socketID)) {
      client.leave(this.room);
      const num = await this.redis.get(`notify_${this.room}_${this.idUser}`);
      console.log(num);
      console.log(typeof num);
      console.log(JSON.stringify(num))
      console.log(typeof JSON.stringify(num))
      if(isNaN(num)) console.log("NaN IS REALLL")
      if (JSON.stringify(num) == "null" || isNaN(num)) {
        this.redis.set(`notify_${this.room}_${this.idUser}`, 1);
        console.log("num null");
        console.log("sending notify...", json.socketID);
        this.server
          .to(`${json.socketID}`)
          .emit("checkRoom", { notify: 1, id: this.idUser });
        client.join([this.room]);
        console.log(client.rooms);
      } else {
        this.redis.set(`notify_${this.room}_${this.idUser}`, parseInt(num) + 1);
        console.log("sending notify...", json.socketID);
        this.server
          .to(`${json.socketID}`)
          .emit("checkRoom", { notify: parseInt(num) + 1, id: this.idUser });
        client.join([this.room]);
        console.log(client.rooms);
      }
    }
  }
  @SubscribeMessage("acceptNewFriend")
  acceptNewFriend(@MessageBody() idF: any, @ConnectedSocket() client: Socket){
     this.redis
      .get(`friendsOrder_${this.idUser}`, (err, data) => {
        if (err) 
          return console.log(err);
       if (JSON.stringify(data) === "null") 
          return this.redis.set(`friendsOrder_${this.idUser}`, JSON.stringify([{ id: idF }]));
        console.log("data", data);
        console.log("MyId:", this.idUser);
        const arrFriend = JSON.parse(data),
          newArr = Array.from(arrFriend),
          posEl = arrFriend.findIndex((e) => e.id === idF);
        console.log(posEl);
        if (posEl !== -1) {
          newArr.splice(posEl, 1);
          newArr.unshift(arrFriend[posEl]);
          this.redis.set(`friendsOrder_${this.idUser}`, JSON.stringify(newArr));
          return this.friendsOrderSocket(idF);
        } 
          newArr.unshift({ id: idF });
          this.redis.set(`friendsOrder_${this.idUser}`, JSON.stringify(newArr));
          return this.friendsOrderSocket(idF);
      });
  }
  @SubscribeMessage("message")
  async message(@MessageBody() resMsg: any): Promise<any>{
    const msg = JSON.parse(resMsg)
    const data = `,${resMsg}]}`
    await this.chatRepository
    .createQueryBuilder("ChatStorage")
    .update(Chat)
    .set({
      ChatData: () => 'concat(substring_index(ChatData, "]", 1), :chatData)'
    })
    .setParameter("chatData", data)
    .where({idChat: this.room})
    .execute()
    
    this.server.to(this.room).emit("message", msg)
    return msg
  }
  @SubscribeMessage("sendLastUpdateLocal")
  sendLastUpdateLocal(@MessageBody() friendArr: any){
    this.redis
    .pipeline()
    .set(`friendsOrder_${this.idUser}`, JSON.stringify(friendArr))
    .exec((err, res) => {
      if (err) return console.log(err);
      console.log(res);
      console.log("new status set..");
    });
  }
  @SubscribeMessage("requireLastUpdate")
  requireLastUpdate(client: Socket): any{
   this.redis.get(`friendsOrder_${this.idUser}`, (err, data) => {
      if (err) return console.error(err);
      client.emit("requireLastUpdate", data);
    });
  }
  @SubscribeMessage("typing")
  typing(@MessageBody() user: any, @ConnectedSocket() client: Socket): any{
    client.to(this.room).broadcast.emit("typing", user) 
  }
  @SubscribeMessage("NoTyping")
  NoTyping(client: Socket): any{
    client.to(this.room).emit("NoTyping");
  }
  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}