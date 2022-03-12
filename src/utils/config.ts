import dotenv from 'dotenv';
import { providers, utils, Wallet } from 'ethers';

dotenv.config();

type ConfigType = {
  MONGODB_URI: string;
  PORT: number;
  JWT_SECRET: string;
  POIGNART_CONTRACT: string;
  CRON_WALLET: Wallet;
  CHAIN_ID: number;
};

export const CONFIG: ConfigType = {
  MONGODB_URI: '',
  PORT: 5000,
  JWT_SECRET: '',
  POIGNART_CONTRACT: '',
  CRON_WALLET: Wallet.createRandom(),
  CHAIN_ID: 0
};

export const initConfig = () => {
  const {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    POIGNART_CONTRACT,
    CRON_PRIVATE_KEY,
    RPC_URL,
    CHAIN_ID
  } = process.env;
  if (
    !MONGODB_URI ||
    !JWT_SECRET ||
    !POIGNART_CONTRACT ||
    !utils.isAddress(POIGNART_CONTRACT) ||
    !CRON_PRIVATE_KEY ||
    !RPC_URL ||
    !CHAIN_ID
  ) {
    throw new Error('Invalid ENV variables');
  }

  CONFIG.MONGODB_URI = MONGODB_URI;
  CONFIG.PORT = PORT ? Number(PORT) : 5000;
  CONFIG.JWT_SECRET = JWT_SECRET;
  CONFIG.POIGNART_CONTRACT = POIGNART_CONTRACT;
  CONFIG.CRON_WALLET = new Wallet(
    CRON_PRIVATE_KEY ?? '',
    new providers.JsonRpcProvider(RPC_URL)
  );
  CONFIG.CHAIN_ID = Number(CHAIN_ID);
};
