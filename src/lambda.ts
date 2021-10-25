import serverlessExpress from '@vendia/serverless-express';
import { Handler, Callback, Context } from 'aws-lambda';
import { defaultApp } from './main';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await defaultApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.path === '/api') {
    event.path = '/api/';
  }

  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
