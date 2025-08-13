import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CAS CORS'));
      }
    },
    credentials: true,
  });
  await app.listen(process.env.PORT || 4002);
}
bootstrap();
