import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function defaultApp() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  return app;
}

async function bootstrap() {
  const app = await defaultApp();

  await app.listen(3000);
}
bootstrap();
