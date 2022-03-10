import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

export const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT ?? 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  POIGNART_CONTRACT: process.env.POIGNART_CONTRACT,
  CRON_WALLET: new ethers.Wallet(
    process.env.CRON_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  )
};
