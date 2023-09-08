export const levels = ['trace', 'debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof levels)[number];

/**
 * general logger settings
 */
export const staticLoggerConfig = {
  rootLoggerName: 'root',
} as const;

export type Log = {
  msg: string;
  data: unknown[];
  meta: {
    date: Date;
    logLevel: LogLevel;
    name: string;
    parentNames: string[];
  };
};

export type TransportLogger = (log: Log) => void;

export type IBaseLogger = {
  /**
   * change log level of logger
   */
  logLevel: LogLevel;

  /**
   * get a logger by its name
   */
  getLogger(name: string): IBaseLogger | undefined;

  /**
   * validate a string is a valid LogLevel
   */
  isLogLevel(level: string): level is LogLevel;

  readonly levels: typeof levels;

  error(message: string): void;
  error(message: string, ...args: unknown[]): void;

  warn(message: string): void;
  warn(message: string, ...args: unknown[]): void;

  info(message: string): void;
  info(message: string, ...args: unknown[]): void;

  debug(message: string): void;
  debug(message: string, ...args: unknown[]): void;

  trace(message: string): void;
  trace(message: string, ...args: unknown[]): void;

  log(level: LogLevel, message: string): void;
  log(level: LogLevel, message: string, args: unknown[]): void;

  /**
   * create a new logger if not already exists
   */
  subLogger(name: string): IBaseLogger;
};

export type RootLogger = IBaseLogger & {
  /**
   * The first transporter that is attached will receive all logs which were recorded before it was attached
   * @param transportLogger
   */
  attachTransport(transportLogger: TransportLogger): void;
};