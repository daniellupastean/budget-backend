import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('WINSTON_LOGGER') private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    this.logger.info(`[ Started ] --> ${req.method} ${req.originalUrl}`);

    const logEnd = () => {
      const duration = Date.now() - start;
      this.logger.info(
        `[ Finished ] --> ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`,
      );
      res.removeListener('finish', logEnd);
    };

    res.on('finish', logEnd);

    next();
  }
}
