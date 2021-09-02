import {Module} from '@nestjs/common'
import {EventsGateway} from './events.gateway'
import {EventsService} from './events.service'
import {AuthService} from './../auth/auth.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {Chat} from './../entities/chat.entity'
import{User} from './../entities/user.entity'
import keys from "./../../secret/keys";

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat, User]),
		JwtModule.register({
			secret: keys.tokenKey
		}),
	],
	exports: [TypeOrmModule],
	providers: [EventsGateway, EventsService, AuthService]
})

export class EventsModule {}