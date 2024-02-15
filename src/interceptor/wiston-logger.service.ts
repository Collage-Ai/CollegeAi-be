import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.initializeLogger();
  }

  private initializeLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    );

    this.logger = winston.createLogger({
      format: logFormat,
      transports: [
        // 控制台输出
        new winston.transports.Console({
          level: 'debug', // 控制台记录debug及以上级别的日志
          format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        // 每日文件轮转
        new DailyRotateFile({
          filename: 'application-%DATE%.log',
          dirname: './logs', // 日志文件存放目录
          level: 'info', // 文件记录info及以上级别的日志
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m', // 最大文件大小
          maxFiles: '14d', // 保留日志文件的天数
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
