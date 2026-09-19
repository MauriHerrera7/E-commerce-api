import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(
    req: Request & { requestId?: string },
    res: Response,
    next: NextFunction,
  ) {
    const requestId = req.header('x-request-id') ?? randomUUID();
    const startedAt = Date.now();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    res.on('finish', () => {
      console.log(
        JSON.stringify({
          level: 'info',
          message: 'http_request',
          requestId,
          method: req.method,
          path: req.originalUrl.split('?')[0],
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
        }),
      );
    });
    next();
  }
}
