import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Handler, Context } from 'aws-lambda';
import { setupSwagger } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    try {
      const app = await NestFactory.create(AppModule);
      app.use(eventContext());
      app.useGlobalPipes(new ValidationPipe());
      setupSwagger(app);
      await app.init();

      const expressApp = app.getHttpAdapter().getInstance();
      cachedServer = createServer(expressApp, undefined, []);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context) => {
  if (event.path === '/api') {
    event.path = '/api/';
  }

  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  console.log(event);
  console.log(event.headers);
  console.log(event.path);
  console.log(process.env.STAGE);

  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
