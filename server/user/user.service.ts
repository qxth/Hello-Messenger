import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { User } from './../entities/user.entity';
import {Questions} from './../entities/questions.entity';
import { createUser } from './dto/user.dto'
import { Response } from 'express';
import {getQuestions} from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Questions)
    private questionsRepository: Repository<Questions>
  ) {}
  async createUser(data: createUser, res: Response): Promise<any> {
    const rows: any = await this.userRepository.createQueryBuilder("UserData")
      .where({nickname: data.nickname})
      .select(['nickname'])
      .getRawMany()
    const error = {nickname: 'nickname must be unique.'};
    if(rows.length > 0)
       throw new HttpException({message: 'Input data validation failed', error}, HttpStatus.BAD_REQUEST);
    const userData: User = new User();
    userData.nickname = data.nickname
    userData.password = data.password
    userData.pregunta = data.pregunta
    userData.respuesta = data.respuesta
    await this.userRepository.save(userData);
    return res.status(HttpStatus.CREATED).json({
        "message": "Has been successfully registered!",
        "status": 201
    })
  }
  async getQuestions(res): Promise<any>{
    const rows: any = await this.questionsRepository.createQueryBuilder("questions")
      .select([])
      .getRawMany();
    const questions: Array<any> = rows.map((res) => {
      const arr = new getQuestions();
      arr.name = res.question;
      arr.value = `${res.id}`;
      return arr;
    });
    return res.status(HttpStatus.OK).json({
        "questions": questions,
        "status": 200
    })
  }
  
}
