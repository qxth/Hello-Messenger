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
import {SocketGuard} from './guards/socketAuth.guard'
import {EventsService} from './events.service'
import {Notify, UserStatus} from './events.interface'
import { Chat } from './../entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, Brackets} from 'typeorm';

@UseGuards(SocketGuard)
@WebSocketGateway({namespace: "chat"})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private readonly logger = new Logger('AppGateway')
  room = undefined
  idFriend = undefined
  redis = new Redis()
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly eventsService: EventsService
  ){}
  updateFriendsPosition (idFriend: any, client: any) {
    const id = client.data.id;
    this.redis.get(`friendsPosition_${idFriend}`, (err, data) => {
    if (err) return console.error(err);
    if (JSON.stringify(data) === "null") 
        return this.redis.set(`friendsPosition_${idFriend}`, JSON.stringify([{ id: id }]));
      const friends = JSON.parse(data),
        newFriends = Array.from(friends),
        posFriends = friends.findIndex((e) => e.id === id);
      if (posFriends !== -1) {
        newFriends.splice(posFriends, 1);
        newFriends.unshift(friends[posFriends]);
        return this.redis.set(`friendsPosition_${idFriend}`, JSON.stringify(newFriends));
      } 
        newFriends.unshift({ id: id });
        this.redis.set(`friendsPosition_${idFriend}`, JSON.stringify(newFriends));
    });
  };
  afterInit(server: Server){
    this.logger.log('Socket initialized')
  }
	@WebSocketServer()
	server: Server;	
  async handleConnection(@ConnectedSocket() client: any): Promise<any> {
    const token = client.handshake.headers.cookie
    const user: any = await this.eventsService.verifyToken(token)
    if(!user){
      return client.disconnect();
    }else{
      this.redis
      .pipeline()
      .set(`status_${user.id}`, "online")
      .set(`dataInit_${user.id}`, `{"id": ${user.id}, "socketID": "${client.id}"}`)
      .exec((err, res) => {
        if(err) return console.log(err);
        this.logger.log(`Client connected: ${client.id}`);
      })
    }
  }
  @SubscribeMessage("checkOnline")
  checkOnline(@MessageBody() data: any, @ConnectedSocket() client: any): any{
    this.redis.get(`status_${data.id}`, (err, res) => {
      if (err) return console.log(err);
      const userStatus:  UserStatus  = {
        status: "green",
        nickname: data.nickname
      }
      if (res !== "online")
        userStatus.status = "red"
      client.emit("checkOnline", userStatus);
    });
  }
  @SubscribeMessage("loadNotify")
  async loadNotify(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<any>{
    const rows = await this.chatRepository
      .createQueryBuilder("ChatStorage")
      .select('ChatStorage.idChat')
      .where({idFriend: data.id})
      .andWhere({idUser: client.data.id})
      .orWhere(new Brackets (qb => {
        qb.where({idFriend: client.data.id})
          .andWhere({idUser: data.id})
      }))
      .getRawMany()
    const totalNotify = await this.redis.get(`notify_${rows[0].ChatStorage_idChat}_${data.id}`);
    const newNotify: Notify = {
      id: data.id,
      nickname: data.name,
      notify: totalNotify
    } 
    client.emit("loadNotify", newNotify)
  }
  @SubscribeMessage("updateRemoteService")
  updateRemoteService(@MessageBody() id: any){
    this.redis.get(`dataInit_${id}`, (err, res) => {
      if (err) return console.error(err);
      const json = JSON.parse(res);
      this.server.to(`${json.socketID}`).emit("updateRemoteService");
    });
  }
  @SubscribeMessage("createRoom")
  createRoom(@MessageBody() data: any, @ConnectedSocket() client: any){
    this.leaveRoom(client)
    (this.room = data.room), (this.idFriend = data.id);
    client.join([data.room]);
    this.redis.set(`notify_${data.room}_${data.id}`, 0);
  }
  @SubscribeMessage("leaveRoom")
  leaveRoom(client: Socket): any{
    if (this.room !== undefined) 
      client.leave(this.room);
    return;
  }
  @SubscribeMessage("sendNotify")
  async sendNotify(client: any): Promise<any>{
    const roomId = await this.server.in(this.room).allSockets(),
      res = await this.redis.get(`dataInit_${this.idFriend}`),
      json = JSON.parse(res);
    this.updateFriendsPosition(this.idFriend, client);
    if (!roomId.has(json.socketID)) {
      client.leave(this.room);
      const num = await this.redis.get(`notify_${this.room}_${client.data.id}`);
      if (JSON.stringify(num) == "null" || isNaN(num)) {
        this.redis.set(`notify_${this.room}_${client.data.id}`, 1);
        this.server
          .to(`${json.socketID}`)
          .emit("sendNotify", { notify: 1, id: client.data.id });
        client.join([this.room]);
      } else {
        this.redis.set(`notify_${this.room}_${client.data.id}`, parseInt(num) + 1);
        this.server
          .to(`${json.socketID}`)
          .emit("sendNotify", { notify: parseInt(num) + 1, id: client.data.id });
        client.join([this.room]);
      }
    }
  }
  @SubscribeMessage("acceptNewFriend")
  acceptNewFriend(@MessageBody() idFriend: any, @ConnectedSocket() client: any){
     this.redis
      .get(`friendsPosition_${client.data.id}`, (err, data) => {
        if (err) 
          return console.log(err);
       if (JSON.stringify(data) === "null") 
          return this.redis.set(`friendsPosition_${client.data.id}`, JSON.stringify([{ id: idFriend }]));
        const friends = JSON.parse(data),
          newFriends = Array.from(friends),
          posFriends = friends.findIndex((e) => e.id === idFriend);
        if (posFriends !== -1) {
          newFriends.splice(posFriends, 1);
          newFriends.unshift(friends[posFriends]);
          this.redis.set(`friendsPosition_${client.data.id}`, JSON.stringify(newFriends));
          return this.updateFriendsPosition(idFriend, client);
        } 
          newFriends.unshift({ id: idFriend });
          this.redis.set(`friendsPosition_${client.data.id}`, JSON.stringify(newFriends));
          return this.updateFriendsPosition(idFriend, client);
      });
  }
  @SubscribeMessage("sendMessage")
  async sendMessage(@MessageBody() data: any): Promise<any>{
    const msg = `,${data}]}` 
    await this.chatRepository
    .createQueryBuilder("ChatStorage")
    .update(Chat)
    .set({
      ChatData: () => 'concat(substring_index(ChatData, "]", 1), :chatData)'
    })
    .setParameter("chatData", msg)
    .where({idChat: this.room})
    .execute()
    this.server.to(this.room).emit("sendMessage", JSON.parse(data))
  }
  @SubscribeMessage("updatePositionFriends")
  updatePositionFriends(@MessageBody() friends: any, @ConnectedSocket() client: any){
    this.redis
    .pipeline()
    .set(`friendsPosition_${client.data.id}`, JSON.stringify(friends))
    .exec((err, res) => {
      if (err) return console.error(err);
    });
  }
  @SubscribeMessage("getPositionFriends")
  requireLastUpdate(client: any): any{
   this.redis.get(`friendsPosition_${client.data.id}`, (err, data) => {
      if (err) return console.error(err);
      client.emit("getPositionFriends", data);
    });
  }
  @SubscribeMessage("typing")
  typing(@MessageBody() user: any, @ConnectedSocket() client: any): any{
    client.broadcast.to(this.room).emit("typing", user) 
  }
  @SubscribeMessage("noTyping")
  NoTyping(client: any): any{
    client.to(this.room).emit("noTyping");
  }
  handleDisconnect(client: any) {
    this.redis
      .pipeline()
      .set(`status_${client.data.id}`, "offline")
      .exec((err, res) => {
        if (err) return console.log(err);
      });
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}