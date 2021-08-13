import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './../entities/chat.entity';
import { Friends } from './../entities/friends.entity';
import {StashFriends} from './../entities/stashFriends.entity'
import {User} from './../entities/user.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Chat, Friends, StashFriends, User])],
  exports: [TypeOrmModule],
  controllers: [ChatController],
  providers: [ChatService],
})

export class ChatModule {}