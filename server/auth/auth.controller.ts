import {UseGuards, Controller, Get, Res,Req, HttpStatus, Body, Post, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import {AuthService} from './auth.service'
import { ValidationPipe } from './../share/validation.pipe'
import routes from './../utils/routes-api'
import {AuthGuard} from '@nestjs/passport'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post(routes.logIn)
  async login(@Req() req: Request, @Res() res: Response): Promise<any>{
   await this.authService.createToken(req.user, res)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(routes.verificarToken)
  async verificarToken(@Req() req: Request, @Res() res: Response){
    return res.status(HttpStatus.OK).json(req.user)
  }
}