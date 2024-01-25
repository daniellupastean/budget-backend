import { format, transports } from 'winston';

const timestampColorizer = format((info, opts) => {
  if (info.timestamp) {
    info.timestamp = `\x1b[33m${info.timestamp}\x1B[0m`; // ANSI escape code for magenta
  }
  return info;
});

const winstonConfig = {
  transports: [
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: `logs/combined.log`,
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.Console({
      format: format.combine(
        format.splat(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format((info) => {
          info.level = info.level.toUpperCase();
          if (info.message === 'Nest application successfully started') {
            info.message = `${info.message}\n`;
          }
          return info;
        })(),
        timestampColorizer(),
        format.colorize({}),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} -> ${level}: ${message}`;
        }),
      ),
    }),
  ],
};

export default winstonConfig;
