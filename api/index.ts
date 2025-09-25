import express from 'express';
import type { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './src/secret.js';
import rootRoute from './src/routes/index.js';
import logger from './src/utils/logger.js';
import { globalErrorHandler } from './src/middleware/global-error.js';

const app: Express = express();

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
  process.exit(1);
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

app.use('/api/v1', rootRoute);

app.use(globalErrorHandler);

logger.info(`🚀 My app is running! Process ID: ${process.pid}`);

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

app.listen(PORT, () => {
  logger.info('Server is running on port ' + PORT);
});

export default app;
