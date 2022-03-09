import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT ?? 5000,
  JWT_SECRET: process.env.JWT_SECRET
};
