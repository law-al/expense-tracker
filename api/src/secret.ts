import dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
console.log('Using env file: ', envFile);
dotenv.config({ path: envFile });

export const PORT = process.env.PORT || 5000;
const DB = process.env.DATABASE_URL || process.env.DATABASE_LOCAL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.mailersend.net';
export const EMAIL_PORT = process.env.EMAIL_PORT;

console.log('DATABASE_URL:', DB);
