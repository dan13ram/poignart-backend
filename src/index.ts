import { Application } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';

import { createServer } from '@/server';
import { CONFIG, initConfig } from '@/utils/config';
import { ensureValidCronWallet } from '@/utils/contract';
import { scheduleCrons } from '@/utils/crons';

initConfig();

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
      ensureValidCronWallet().then(() => {
        scheduleCrons();
      });
    });
  });
