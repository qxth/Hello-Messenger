import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { Observable } from 'rxjs';
import {EventsService} from './../events.service'

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private readonly eventsService: EventsService){}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try{
      const req = context.switchToWs().getClient();
      const token = req.handshake.headers.cookie
       return new Promise<boolean>(async (resolve, reject) => {
        const user = await this.eventsService.verifyToken(token)
        if(!user)
          resolve(false);
        req.data = user
        resolve(true); 
      });
    }catch(err){
      console.error(err)
      return false;
    }
  }
}