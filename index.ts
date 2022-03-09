import mongoose, { ConnectOptions } from 'mongoose';
import { Application } from 'express';
import createServer from './server';

import { CONFIG } from './config';

mongoose
  .connect(CONFIG.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => {
    createServer().then((app: Application) => {
      app.listen(CONFIG.PORT, () =>
        console.log(`Listening on port ${CONFIG.PORT}`)
      );
    });
  });
