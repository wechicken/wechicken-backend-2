import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

export async function defaultApp() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  return app;
}

async function bootstrap() {
  const app = await defaultApp();
  await app.listen(3000);
}
process.env.STAGE === 'nest' && void bootstrap();
