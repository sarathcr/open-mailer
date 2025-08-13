import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { configureCors } from './config/cors';
import { setUpProxies } from './config/proxies';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureCors(app);
  app.use(cookieParser());

  setUpProxies(app);

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
