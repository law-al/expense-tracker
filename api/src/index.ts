import express from 'express';
import type { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './secret.js';
import rootRoute from './routes/index.js';
import logger from './utils/logger.js';
import { globalErrorHandler } from './middleware/global-error.js';
import { rateLimit } from './middleware/limiter.js';

const app: Express = express();

process.on('uncaughtException', () => {
  process.exit(1);
});

process.on('unhandledRejection', () => {
  process.exit(1);
});

app.use(rateLimit(30 * 60 * 1000, 100)); // 100 requests per 15 minutes per IP
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

app.use('/api/v1', rootRoute);

app.use(globalErrorHandler);

logger.info(`🚀 My app is running! Process ID: ${process.pid}`);

app.listen(PORT, () => {
  logger.info('Server is running on port ' + PORT);
});
