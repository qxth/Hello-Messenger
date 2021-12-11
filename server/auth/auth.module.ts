import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './../entities/user.entity';
import {LocalStrategy} from './passport.auth'
import {JwtStrategy} from './jwt.auth'
import {PassportModule} from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import secretKeys from "./../../secret/keys";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: secretKeys.tokenKey
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy    
  ],
  exports: [TypeOrmModule],
})

export class AuthModule {}
