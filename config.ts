import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: Number(process.env.JWT_SECRET ?? 86400)
};
