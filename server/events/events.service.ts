import {Injectable} from '@nestjs/common'
import {Notify, UserStatus} from './events.interface'
import {AuthService} from './../auth/auth.service'
import keys from "./../../secret/keys";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class EventsService{
  constructor(
    private readonly authService: AuthService
  ){}
  async verifyToken(token: any): Promise<any>{
    try{
      const payload = await jwt.verify(token.split("jwt=")[1], keys.tokenKey)
      const user = await this.authService.validateToken(payload)
      if(!user)
        return false;
      return user;
    }catch(err){
      return false
    }
  }
}