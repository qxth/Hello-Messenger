import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { User } from './../entities/user.entity';
import {authLogin } from './dto/auth.dto'
import { Response } from 'express';
import * as argon2 from 'argon2';
import {UserInterface, UserClass} from './auth.interface'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  async authLogin({nickname, password}: authLogin):Promise<UserInterface> {
    const rows: any = await this.userRepository.createQueryBuilder("UserData")
    .select(['id', 'nickname', 'password'])
    .where({nickname: nickname})
    .getRawMany()
    if(rows.length < 1)
      return null
    const user: UserInterface = new UserClass()
    user.id = rows[0].id
    user.nickname = rows[0].nickname
    const passwordVerify = await argon2.verify(rows[0].password, password)    
    if(passwordVerify)
      return user;
    return null;
  }
  async createToken(user: any, res: Response): Promise<any>{
     const token = this.jwtService.sign({id: user.id, nickname: user.nickname})
     res.cookie("jwt", token, {
      secure: false,
      httpOnly: false,
     });
     res.status(HttpStatus.OK).json({
      status: 200,
      token: token
     })
  }
  async validateToken(payload: any): Promise<any>{
    const rows: any = await this.userRepository.createQueryBuilder("UserData")
    .select(['id'])
    .where({id: payload.id})
    .getRawMany()
    if(rows.length<1)
      return null;
    return {id: payload.id, nickname: payload.nickname};
  }
}
