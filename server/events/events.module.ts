import {Module} from '@nestjs/common'
import {EventsGateway} from './events.gateway'
import { TypeOrmModule } from '@nestjs/typeorm';
import {Chat} from './../entities/chat.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Chat])],
	exports: [TypeOrmModule],
	providers: [EventsGateway]
})

export class EventsModule {}