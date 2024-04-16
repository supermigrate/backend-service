import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const method = req.method;
      const url = req.originalUrl;
      const status = res.statusCode;
      const contentLength = res.getHeader('Content-Length') || 0;
      this.logger.log(
        `${method} ${url} ${status} ${contentLength} - ${responseTime} ms`,
      );
    });

    next();
  }
}
