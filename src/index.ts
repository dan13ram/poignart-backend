import { CONFIG } from 'config';
import { Application } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { createServer } from 'server';
import { ensureValidCronWallet } from 'utils/contract';
import { scheduleCrons } from 'utils/crons';

mongoose
  .connect(CONFIG.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => {
    createServer().then((app: Application) => {
      ensureValidCronWallet().then(() => {
        scheduleCrons().then(() => {
          app.listen(CONFIG.PORT, () =>
            console.log(`Listening on port ${CONFIG.PORT}`)
          );
        });
      });
    });
  });
