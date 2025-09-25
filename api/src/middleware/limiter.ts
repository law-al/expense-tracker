import { rateLimit as createRateLimit } from 'express-rate-limit';
import slowdown from 'express-slow-down';

export const rateLimit = (windowMs: number = 15 * 60 * 1000, max: number) => {
  return createRateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const speedLimiter = (
  windowMs: number = 15 * 60 * 1000,
  delayAfter: number = 10,
  delayMs: number = 500
) => {
  return slowdown({
    windowMs,
    delayAfter,
    delayMs: (hits: number) => hits * delayMs,
    legacyHeaders: false,
  });
};
