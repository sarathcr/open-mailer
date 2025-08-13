import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AppModule } from './app.module';

delete process.env.PORT;
const envPath = resolve(process.cwd(), './.env');
config({ path: envPath });

async function bootstrap() {
  console.log('Mailer Runs on: ', process.env.PORT);
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });
  await app.listen(process.env.PORT || 4001);
}
bootstrap();
