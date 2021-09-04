import { 
  Controller, 
  Get, Delete, Post,
  Req, Res, 
  HttpStatus, UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import routes from './../../utils/routes-api'
import {AuthGuard} from '@nestjs/passport'
import {ChatService} from './chat.service'

@UseGuards(AuthGuard('jwt'))
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService){}
  @Post(routes.getChat)
  async getChat(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.getAllHistory(req, res)
  }
  @Get(routes.getAllFriends)
  async getAllFriends(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.getAllFriends(req, res);
  }
  @Get(routes.stashFriends)
  async getStashFriends(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.getStashFriends(req, res); 
  }
  @Post(routes.addFriends)
  async addFriends(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.addFriends(req, res);
  }
  @Post(routes.acceptFriends)
  async acceptFriends(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.acceptFriends(req, res);
  }
  @Delete(routes.rejectFriends)
  async rejectFriends(@Req() req: Request, @Res() res: Response): Promise<any>{
    return await this.chatService.rejectFriends(req, res);
  }
}