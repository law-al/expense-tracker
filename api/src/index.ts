import express from 'express';
import type { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './secret.js';
import rootRoute from './routes/index.js';
import logger from './utils/logger.js';
import { globalErrorHandler } from './middleware/global-error.js';

const app: Express = express();

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
  process.exit(1);
});

app.set('trust proxy', true);
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'https://expense-tracker-nu-mocha.vercel.app',
    // origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/api/v1', rootRoute);

app.use(globalErrorHandler);

logger.info(`🚀 My app is running! Process ID: ${process.pid}`);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express on Vercel!');
});

app.listen(PORT, () => {
  logger.info('Server is running on port ' + PORT);
});

export default app;
