import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Handler, Context } from 'aws-lambda';
import { setupSwagger } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      const app = await NestFactory.create(AppModule, adapter);
      app.use(eventContext());
      app.use(express.json());
      app.useGlobalPipes(new ValidationPipe());
      // setupSwagger(app);
      await app.init();
      cachedServer = createServer(expressApp, undefined, []);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  // if (event.path === '/api') {
  //   event.path = '/api/';
  // }

  // event.path = event.path.includes('swagger-ui')
  //   ? `/api${event.path}`
  //   : event.path;

  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
