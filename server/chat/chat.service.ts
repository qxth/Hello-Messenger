import { Injectable, HttpStatus} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, Brackets} from 'typeorm';
import {Request, Response} from 'express'
import { Chat } from './../entities/chat.entity';
import {Friends} from './../entities/friends.entity'
import {StashFriends} from './../entities/stashFriends.entity';
import {User} from './../entities/user.entity'

@Injectable()
export class ChatService {
	constructor(  
		@InjectRepository(Chat)
    	private chatRepository: Repository<Chat>,
    	@InjectRepository(Friends)
    	private friendsRepository: Repository<Friends>,
    	@InjectRepository(StashFriends)
    	private stashFriendsRepository: Repository<StashFriends>,
    	@InjectRepository(User)
    	private userRepository: Repository<User>
    ){}
	async getAllHistory (req: Request, res: Response): Promise<any>{
		const id  = req.user.id
		const friendId = req.body.id
		const rows = await this.chatRepository.createQueryBuilder("ChatStorage")
		.select(['ChatData', 'idChat'])
		.where({idFriend: friendId})
		.andWhere({idUser: id})
		.orWhere(new Brackets (qb => {
			qb.where({idFriend: id})
			.andWhere({idUser: friendId})
		}))
		.getRawMany()
		console.log(rows)
	    if(rows.length < 0)
	       throw new HttpException({
	       	status:  HttpStatus.BAD_REQUEST, 
	       	message: 'Not found', 
	       	chat: 'Chat not found!'
	       }, HttpStatus.BAD_REQUEST);
		const dataChat = [JSON.parse(rows[0].ChatData)]
		console.log(dataChat)
		return res.status(HttpStatus.OK).json({
			status: 200,
			dataChat,
			idChat: rows[0].idChat
		})
	}
	async getAllFriends(req: Request, res: Response): Promise<any>{
		const rows = await this.friendsRepository
		.createQueryBuilder("Friends")
		.innerJoin('Friends.user', 'user')
		.select(['user.id', 'user.nickname'])
		.where({idUser: req.user.id})
		.getRawMany()
		return res.status(HttpStatus.OK).json({
			status: 200,
			rows
		})
	}
	async getStashFriends(req: Request, res: Response): Promise<any>{
		console.log(req.user)
		const rows = await this.stashFriendsRepository
		.createQueryBuilder("stashFriends")
		.innerJoin('stashFriends.user', 'user')
		.select(['user.id', 'user.nickname'])
		.where({idFriend: req.user.id})
		.getRawMany()
		return res.status(HttpStatus.OK).json({
			status: 200,
			rows
		})
	}
	async addFriends(req: Request, res: Response): Promise<any>{
		const id = req.user.id
		const idFriend = req.body.idFriend
	    const user = await this.userRepository.createQueryBuilder("UserData")
	    .select(['id', 'nickname'])
	    .where({nickname: req.body.nickname})
	    .getRawMany()
	    if(user.length < 1 && id === user[0].id)
			throw new HttpException({
				status:  HttpStatus.BAD_REQUEST, 
				message: 'Not found', 
				chat: 'User not found!'
			}, HttpStatus.BAD_REQUEST);
    	const stash = await this.stashFriendsRepository
    	.createQueryBuilder("stashFriends")
    	.select(['id', 'idFriend'])
		.where({idFriend: id})
		.andWhere({id: user[0].id})
		.orWhere(new Brackets (qb => {
			qb.where({idFriend: user[0].id})
			.andWhere({id: id})
		}))
		.getRawMany()
		if(stash.length > 1)
			throw new HttpException({
				status:  HttpStatus.BAD_REQUEST, 
				message: 'Friend request', 
				chat: 'The friend request has already been sent to the user!'
			}, HttpStatus.BAD_REQUEST);
		const friend = await this.friendsRepository
		.createQueryBuilder("Friends")
        .select(['idUser', 'idFriend'])
	    .where({idUser: id})
	    .andWhere({idFriend: user[0].id})
	    .getRawMany()
		if(stash.length > 1)
		throw new HttpException({
			status:  HttpStatus.BAD_REQUEST, 
			message: 'Friend request', 
			chat: 'The friend has already been added!'
		}, HttpStatus.BAD_REQUEST);
		const stashData = new StashFriends()
		stashData.id = id
		stashData.idFriend = user[0].id
		const stashFriend = await this.stashFriendsRepository.save(stashData)
		return res.status(HttpStatus.OK).json({
			status: HttpStatus.OK,
			message: "Friend request has been send",
			idFriend: user[0].id
		})
	}
	async acceptFriends (req: Request, res: Response): Promise<any>{
	    const id = req.user.id;	
	    const idFriend = req.body.idFriend    
    	const stashUser = await this.stashFriendsRepository
    	.createQueryBuilder("stashFriends")
    	.select(['id', 'idFriend'])
		.where({idFriend: id})
		.andWhere({id: idFriend})
		.orWhere(new Brackets (qb => {
			qb.where({idFriend: id})
			.andWhere({id: idFriend})
		}))
		.getRawMany()
		if(stashUser.length < 1)
			throw new HttpException({
				status:  HttpStatus.BAD_REQUEST, 
				message: 'Friend request not found', 
				chat: 'Friend request is not founded!'
			}, HttpStatus.BAD_REQUEST);
		const friend = await this.friendsRepository
		.createQueryBuilder("Friends")
		.insert()
		.into(Friends)
		.values([
			{idUser: id, idFriend: idFriend},
			{idUser: idFriend, idFriend: id}
		])
		.execute()
		const chatUser = new Chat()
		chatUser.idUser = id
		chatUser.idFriend = idFriend
		chatUser.ChatData = JSON.stringify({ ChatData: [{}] })
		chatUser.Fecha = new Date()
		await this.chatRepository.save(chatUser)

		const stash = await this.stashFriendsRepository
		.createQueryBuilder("stashFriends")
		.delete()
		.where({idFriend: id})
		.andWhere({id: idFriend})
		.execute()
		return res.status(HttpStatus.OK).json({
			status: 200,
			message: "Added to a friend"
		})
	}
	async rejectFriends (req: Request, res: Response): Promise<any>{
		const stash = await this.stashFriendsRepository
		.createQueryBuilder("stashFriends")
		.delete()
		.from(StashFriends)
		.where({idFriend: req.user.id})
		.andWhere({id: req.body.idFriend})
		.execute()
		return res.status(HttpStatus.OK).json({
			status: 200,
			message: "Friend request canceled!"
		})
	}
}