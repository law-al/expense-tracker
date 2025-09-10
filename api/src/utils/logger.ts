import winston from 'winston';

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create logger
const logger = winston.createLogger({
  level: 'debug', // log everything from debug and above
  format: winston.format.combine(
    winston.format.colorize(), // adds colors for console
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // logs show up in terminal
  ],
});

export default logger;
