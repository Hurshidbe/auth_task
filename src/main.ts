import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ValidationError } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist : true, forbidNonWhitelisted : true}))
  await app.listen(process.env.PORT ?? 3000);
  console.warn(`server is running on ${process.env.PORT}`)
}
bootstrap();
