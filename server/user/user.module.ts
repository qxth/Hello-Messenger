import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './../entities/user.entity';
import {Questions} from './../entities/questions.entity'
 
@Module({
  imports: [TypeOrmModule.forFeature([User, Questions])],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}
