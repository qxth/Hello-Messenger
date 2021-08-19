import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import devBundle from './devBundle';
import * as cookie from "cookie-parser";
import * as bodyParser from "body-parser";
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from './adapters/redis-io.adapters'
import { IoAdapter } from '@nestjs/platform-socket.io';
declare const module: any;

async function bootstrap() {
  try{
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.enableCors({
      origin: true,
      methods: '*',
      credentials: true,
    });
    app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'Nerd Range')
      next()
    })
    app.use(cookie());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    devBundle.compile(app)
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
    if (module.hot) {
      module.hot.accept()
      module.hot.dispose(async () => await app.close());
    }
  }catch(e){
    console.error(e)
  }
}
bootstrap();
