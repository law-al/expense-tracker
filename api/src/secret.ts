import dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
console.log('Using env file: ', envFile);
dotenv.config({ path: envFile });

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.mailersend.net';
export const EMAIL_PORT = process.env.EMAIL_PORT;

console.log('Environment Variables:');
console.log('PORT:', PORT);
console.log('JWT_SECRET:', JWT_SECRET ? '******' : 'Not Set');
console.log('NODE_ENV:', NODE_ENV);
console.log('EMAIL_USER:', EMAIL_USER);
console.log('EMAIL_HOST:', EMAIL_HOST);
console.log('EMAIL_PORT:', EMAIL_PORT);
