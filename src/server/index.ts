import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';

import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from '@/graphql/typedefs';
import { validateRequest, verifyToken } from '@/middlewares/auth';
import { ROUTES } from '@/server/routes';

export const createServer = async (): Promise<Application> => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      if (!verifyToken(req) && process.env.NODE_ENV !== 'development')
        throw Error('Unauthorized');
    },
    plugins: [
      process.env.NODE_ENV !== 'development'
        ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
        : ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use(morgan('tiny'));

  app.use('/api', validateRequest, ROUTES);

  // ---------- ROOT REQUEST ----------
  app.get('/', (_req: Request, res: Response) =>
    res.json('Freedom is under attack. Creators are fighting back!')
  );

  return app;
};
