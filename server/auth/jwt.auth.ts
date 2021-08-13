import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as cookies from "cookie-parser";
import keys from "./../../secret/keys";
import { AuthService } from './auth.service';

const cookieToken = (req ) => { 
	let token = null;
	if (!req.cookies["jwt"]) return token;
	token = req.cookies["jwt"];
	return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(private readonly authService: AuthService){ 
		super({
			secretOrKey: keys.tokenKey,
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors([cookieToken])
		})
	}
	async validate(payload: any): Promise<any>{
		const user = this.authService.validateToken(payload)
		if(!user)
		  throw new UnauthorizedException();
		return user;
	}
}