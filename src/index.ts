import mongoose, { ConnectOptions } from 'mongoose';
import { Application } from 'express';
import createServer from './server';

import { CONFIG } from './config';
import { scheduleCrons } from './utils/crons';
import { ensureValidCronWallet } from './utils/contract';

mongoose
  .connect(CONFIG.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => {
    createServer().then((app: Application) => {
      ensureValidCronWallet().then(() => {
        scheduleCrons();
        app.listen(CONFIG.PORT, () =>
          console.log(`Listening on port ${CONFIG.PORT}`)
        );
      });
    });
  });
