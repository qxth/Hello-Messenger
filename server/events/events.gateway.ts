import {Logger, UseGuards} from '@nestjs/common'
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
import * as socket from 'socket.io';
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
  redis = new Redis()
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly eventsService: EventsService
  ){}
  updateFriendsPosition (idFriend: any, client: Socket) {
    const id = client.data.id;
    this.redis.get(`friendsPositio:${idFriend}`, (err, data) => {
    if (err) return console.error(err);
    if (JSON.stringify(data) === "null") 
        return this.redis.set(`friendsPosition:${idFriend}`, JSON.stringify([{ id: id }]));
      const friends = JSON.parse(data),
        newFriends = Array.from(friends),
        posFriends = friends.findIndex((e) => e.id === id);
      if (posFriends !== -1) {
        newFriends.splice(posFriends, 1);
        newFriends.unshift(friends[posFriends]);
        return this.redis.set(`friendsPosition:${idFriend}`, JSON.stringify(newFriends));
      } 
        newFriends.unshift({ id: id });
        this.redis.set(`friendsPosition:${idFriend}`, JSON.stringify(newFriends));
    });
  };
  afterInit(server: Server){
    this.logger.log('Socket initialized')
  }
	@WebSocketServer()
	server: Server;	

  async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
    const token = client.handshake.headers['cookie']
    const user: any = await this.eventsService.verifyToken(token)
    if(!user){
      return client.disconnect();
    }
      this.redis
      .pipeline()
      .set(`status:${user.id}`, "online")
      .set(`infoUser:${user.id}`, `{"id": ${user.id}, "socketID": "${client.id}"}`)
      .exec((err, res) => {
        if(err) return console.log(err);
        this.logger.log(`Client connected: ${client.id}`);
      })
  }
  @SubscribeMessage("checkOnline")
  checkOnline(@MessageBody() data: any, @ConnectedSocket() client: Socket): any{
    this.redis.get(`status:${data.id}`, (err, res) => {
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
  async loadNotify(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any>{
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
    const totalNotify = await this.redis.get(`notify:${rows[0].ChatStorage_idChat}:${data.id}`);
    const newNotify: Notify = {
      id: data.id,
      nickname: data.name,
      notify: totalNotify
    } 
    client.emit("loadNotify", newNotify)
  }
  @SubscribeMessage("updateRemoteService")
  updateRemoteService(@MessageBody() id: any){
    console.log("id", id)
    this.redis.get(`infoUser:${id}`, (err, res) => {
      if (err) return console.error(err);
      const json = JSON.parse(res);
      this.server.to(`${json.socketID}`).emit("updateRemoteService");
    });
  }
  @SubscribeMessage("createRoom")
  createRoom(@MessageBody() dataChat: any, @ConnectedSocket() client: Socket){
     this.redis.get(`localData:${client.data.id}`, (err, data) => {
      if(data){
        const localData = JSON.parse(data)
        client.leave(localData.room);
        console.log("Room leaved", localData.room)
      }
      this.redis
      .pipeline()
      .set(`notify:${dataChat.room}:${dataChat.id}`, 0)
      .set(`localData:${client.data.id}`, `{"room": ${dataChat.room}, "idFriend": ${dataChat.id}}`)
      .exec((err, res) => {
        if (err) return console.error(err);
        client.join([dataChat.room]);
        console.log("Room joined", dataChat.room)
      });
     })
  }
  @SubscribeMessage("leaveRoom")
  async leaveRoom( @ConnectedSocket() client: Socket): Promise<any>{
    const localData = JSON.parse(await this.redis.get(`localData:${client.data.id}`))
    if (localData) 
      client.leave(localData.room);
  }
  @SubscribeMessage("sendNotify")
  async sendNotify(@ConnectedSocket() client: Socket): Promise<any>{
    try{
      const localData = JSON.parse(await this.redis.get(`localData:${client.data.id}`))
      const roomId = await this.server.in(localData.room).allSockets(),
        res = await this.redis.get(`infoUser:${localData.idFriend}`),
        json = JSON.parse(res);
      this.updateFriendsPosition(localData.idFriend, client);
      if (!roomId.has(json.socketID)) {
          client.leave(localData.room);
          const numNotifys = await this.redis.get(`notify:${localData.room}:${client.data.id}`);

          if (JSON.stringify(numNotifys) == "null" || isNaN(numNotifys)) {
          this.redis.set(`notify:${localData.room}:${client.data.id}`, 1);
          this.server
          .to(`${json.socketID}`)
          .emit("sendNotify", { notify: 1, id: client.data.id });
          client.join([localData.room]);
          return;
        }
          this.redis.set(`notify:${localData.room}:${client.data.id}`, parseInt(numNotifys) + 1);
          this.server
          .to(`${json.socketID}`)
          .emit("sendNotify", { notify: parseInt(numNotifys) + 1, id: client.data.id });
          client.join([localData.room]);
        
      }
    }catch(err){
      console.error(err)
    }
  }
  @SubscribeMessage("acceptNewFriend")
  acceptNewFriend(@MessageBody() idFriend: any, @ConnectedSocket() client: Socket){
     this.redis
      .get(`friendsPosition:${client.data.id}`, (err, data) => {
        if (err) 
          return console.log(err);
       if (JSON.stringify(data) === "null") 
          return this.redis.set(`friendsPosition:${client.data.id}`, JSON.stringify([{ id: idFriend }]));
        const friends = JSON.parse(data),
          newFriends = Array.from(friends),
          posFriends = friends.findIndex((e) => e.id === idFriend);
        if (posFriends !== -1) {
          newFriends.splice(posFriends, 1);
          newFriends.unshift(friends[posFriends]);
          console.log("newFriends", newFriends)
          this.redis.set(`friendsPosition:${client.data.id}`, JSON.stringify(newFriends));
          this.updateFriendsPosition(idFriend, client);
        } 
          newFriends.unshift({ id: idFriend });
          this.redis.set(`friendsPosition:${client.data.id}`, JSON.stringify(newFriends));
          this.updateFriendsPosition(idFriend, client);
      });
  }
  @SubscribeMessage("sendMessage")
  async sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any>{
    const localData = JSON.parse(await this.redis.get(`localData:${client.data.id}`))
    const msg = `,${data}]}` 
    await this.chatRepository
    .createQueryBuilder("ChatStorage")
    .update(Chat)
    .set({
      ChatData: () => 'concat(substring_index(ChatData, "]", 1), :chatData)'
    })
    .setParameter("chatData", msg)
    .where({idChat: localData.room})
    .execute()
    this.server.to(localData.room).emit("sendMessage", JSON.parse(data))
  }
  @SubscribeMessage("updatePositionFriends")
  updatePositionFriends(@MessageBody() friends: any, @ConnectedSocket() client: Socket){
    console.log("data updatePositionFriends", friends)
    this.redis
    .pipeline()
    .set(`friendsPosition:${client.data.id}`, JSON.stringify(friends))
    .exec((err, res) => {
      if (err) return console.error(err);
      console.log("Friends position updated")
    });
  }
  @SubscribeMessage("getPositionFriends")
  requireLastUpdate(@ConnectedSocket()client: Socket): any{
   this.redis.get(`friendsPosition:${client.data.id}`, (err, data) => {
      if (err) return console.error(err);
      client.emit("getPositionFriends", data);
    });
  }
  @SubscribeMessage("typing")
  async typing(@ConnectedSocket() client: Socket): Promise<any>{
    const localData = JSON.parse(await this.redis.get(`localData:${client.data.id}`))
    client.broadcast.to(localData.room).emit("typing", client.data.nickname) 
  }
  @SubscribeMessage("noTyping")
  async NoTyping(@ConnectedSocket()client: Socket): Promise<any>{
   const localData = JSON.parse(await this.redis.get(`localData:${client.data.id}`))
    client.to(localData.room).emit("noTyping");
  }
  handleDisconnect(client: Socket) {
    this.redis
      .pipeline()
      .set(`status:${client.data.id}`, "offline")
      .exec((err, res) => {
        if (err) return console.log(err);
      });
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}