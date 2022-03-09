import express, { Request, Response, Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import ROUTER from './routes/routes';

import { typeDefs } from './schema/typedefs';
import { resolvers } from './schema/resolvers';
import { verifyToken, validateRequest } from './middlewares/auth';

const createServer = async (): Promise<Application> => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      if (!verifyToken(req)) throw Error('Unauthorized');
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  // ---------- CREATE ROUTES ----------
  app.use('/create', validateRequest, ROUTER);

  // ---------- ROOT REQUEST ----------
  app.get('/', (_req: Request, res: Response) =>
    res.json('Freedom is under attack. Creators are fighting back!')
  );

  return app;
};

export default createServer;
