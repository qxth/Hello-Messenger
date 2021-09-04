import { Controller, Get, Res, HttpStatus, Body, Post, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import {UserService} from './user.service'
import {createUser} from './dto/user.dto'
import { ValidationPipe } from './../share/validation.pipe'
import routes from './../../utils/routes-api'

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  @Post(routes.createUser)
  async createUser(@Body(new ValidationPipe()) User: createUser, @Res() res: Response): Promise<any>{
    return await this.userService.createUser(User, res);
  }
  @Get(routes.getQuestions)
  async getQuestions(@Res() res: Response): Promise<any>{
    return await this.userService.getQuestions(res);
  }
}