import {Get, Res, Controller} from '@nestjs/common'
import template from './../index.js'
import {Response} from 'express'

@Controller()
export class AppController {
	@Get()
	clientRender(@Res() res: Response): any{
		return res.status(200).send(template());
	}
}