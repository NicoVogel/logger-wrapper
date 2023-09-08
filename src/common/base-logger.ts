import {type Logger} from 'pino';
import {IBaseLogger, LogLevel, levels} from './interface';

export class BaseLogger implements IBaseLogger {
  get logLevel(): LogLevel {
    return this.logger.level as LogLevel;
  }

  set logLevel(level: LogLevel) {
    this.logger.level = level;
  }

  readonly levels = levels;

  constructor(
    protected logger: Logger,
    protected loggerMap: Map<string, BaseLogger>
  ) {}

  getLogger(name: string): BaseLogger | undefined {
    return this.loggerMap.get(name);
  }

  isLogLevel(level: string): level is LogLevel {
    return (levels as readonly string[]).includes(level);
  }

  error(message: string): void;
  error(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]) {
    this.log('error', message, args);
  }

  warn(message: string): void;
  warn(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, args);
  }

  info(message: string): void;
  info(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]) {
    this.log('info', message, args);
  }

  debug(message: string): void;
  debug(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, args);
  }

  trace(message: string): void;
  trace(message: string, ...args: unknown[]): void;
  trace(message: string, ...args: unknown[]) {
    this.log('trace', message, args);
  }

  log(level: LogLevel, message: string): void;
  log(level: LogLevel, message: string, args: unknown[]): void;
  log(level: LogLevel, message: string, args?: unknown[]) {
    if (args === undefined) {
      this.logger[level](message);
      return;
    }
    /**
     * pino will not serialize the arguments correctly, if the message is the first argument of the function
     */
    this.logger[level]([args], message);
  }

  subLogger(name: string): BaseLogger {
    const existingLogger = this.loggerMap.get(name);
    if (existingLogger) {
      return existingLogger;
    }

    const logger = new BaseLogger(
      this.logger.child({module: name}),
      this.loggerMap
    );
    this.loggerMap.set(name, logger);
    return logger;
  }
}
