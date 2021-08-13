import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
	constructor(private readonly authService: AuthService){
		super({
			usernameField: "nickname",
			passwordField: "password"
		})
	}
	async validate(nickname: string, password: string): Promise<any>{
		const user = await this.authService.authLogin({nickname, password})
		if(!user)
			throw new UnauthorizedException();
		return user;
	}
}
