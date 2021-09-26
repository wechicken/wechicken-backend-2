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
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
