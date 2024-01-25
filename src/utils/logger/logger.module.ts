import { Module, Global } from '@nestjs/common';
import winstonConfig from 'src/config/winston.config';
import { createLogger } from 'winston';

const logger = createLogger(winstonConfig);

@Global()
@Module({
  providers: [{ provide: 'WINSTON_LOGGER', useValue: logger }],
  exports: ['WINSTON_LOGGER'],
})
export class LoggingModule {}
