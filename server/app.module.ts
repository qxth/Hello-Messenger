import { 
	Module, NestModule, MiddlewareConsumer, 
	Get, RequestMethod, NestMiddleware
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Request, Response, NextFunction} from 'express';
import {ChatModule} from './chat/chat.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {User} from './entities/user.entity'
import {Questions} from './entities/questions.entity'
import { Chat } from './entities/chat.entity';
import { Friends } from './entities/friends.entity' 
import {StashFriends} from './entities/stashFriends.entity'
import template from './../index.js'
import routes from './../utils/routes-api'
import {EventsModule} from './events/events.module'
import { createConnection } from 'typeorm';

@Module({
  imports: [
	UserModule, ChatModule, 
	AuthModule, EventsModule,
	TypeOrmModule.forRoot({
		type: "mysql",
		host: "localhost",
		port: 3306,
		username: "root",
		password: "",
		database: "ChatApp",
		charset: "utf8mb4_unicode_ci",
		entities: [User, Questions, Chat, Friends, StashFriends],
		synchronize: true
	})
  ],
})

export class AppModule implements NestModule{
	  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
      class clientLogger implements NestMiddleware {
  			use(req: Request, res: Response, next: NextFunction) {
      		const routesApi = Object.values(routes)
      		.findIndex(e => e === req.originalUrl)
      		if(routesApi <= -1)
      			return res.status(200).send(template());
		    	next();
  			}
      })
      .forRoutes({path: '*', method: RequestMethod.GET});
  }
}