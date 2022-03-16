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
  MAX_VOUCHERS: number;
  RATE_LIMIT_DURATION: number;
};

export const CONFIG: ConfigType = {
  MONGODB_URI: '',
  PORT: 5000,
  JWT_SECRET: '',
  POIGNART_CONTRACT: '',
  CRON_WALLET: Wallet.createRandom(),
  CHAIN_ID: 0,
  MAX_VOUCHERS: 10,
  RATE_LIMIT_DURATION: 60 * 60 * 1000 // 10 per hr
};

export const initConfig = () => {
  const {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    POIGNART_CONTRACT,
    CRON_PRIVATE_KEY,
    RPC_URL,
    CHAIN_ID,
    MAX_VOUCHERS,
    RATE_LIMIT_DURATION
  } = process.env;
  if (
    !MONGODB_URI ||
    !JWT_SECRET ||
    !POIGNART_CONTRACT ||
    !utils.isAddress(POIGNART_CONTRACT) ||
    !CRON_PRIVATE_KEY ||
    !RPC_URL ||
    !CHAIN_ID ||
    Number.isNaN(Number(CHAIN_ID)) ||
    !MAX_VOUCHERS ||
    Number.isNaN(Number(MAX_VOUCHERS)) ||
    !RATE_LIMIT_DURATION ||
    Number.isNaN(Number(RATE_LIMIT_DURATION))
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
  CONFIG.MAX_VOUCHERS = Number(MAX_VOUCHERS);
  CONFIG.RATE_LIMIT_DURATION = Number(RATE_LIMIT_DURATION);
};
