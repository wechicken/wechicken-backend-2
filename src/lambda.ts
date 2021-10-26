import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context } from 'aws-lambda';
import { defaultApp, setupSwagger } from './main';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    try {
      const app = await defaultApp();
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

  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
