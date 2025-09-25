import { rateLimit as createRateLimit } from 'express-rate-limit';
import { slowDown as createSlowDown } from 'express-slow-down';

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
  return createSlowDown({
    windowMs,
    delayAfter,
    delayMs: (hits: number) => hits * delayMs,
    legacyHeaders: false,
  });
};
