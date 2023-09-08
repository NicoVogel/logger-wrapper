import pino from 'pino';
import {
  RootLogger,
  Log,
  LogLevel,
  TransportLogger,
  staticLoggerConfig,
} from '../common/interface';

import { BaseLogger } from '../common/base-logger';

type PinoLogWriteObject = {
  level: number;
  module: string | undefined;
  msg: string;
  time: number;
  0?: unknown[];
};

function formatTime(ts: number) {
  const date = new Date(ts);
  return `${date.toLocaleTimeString().split(' ')[0]}.${date.getMilliseconds()}`;
}

type LogConfig = {
  prefix: string;
  bannerStyle: string;
  consoleFunc: keyof Console;
};

const commonLogConfig = {
  timeStyle: 'color: white',
  moduleStyle: 'font-weight: bold; color: yellow',
  message: ' %c[%s] %c%s',
} as const;

/**
 * use `%c` to apply css rules to the console output
 * source: https://developer.chrome.com/docs/devtools/console/format-style/
 */
const logConfig = {
  error: {
    prefix: '%cERROR',
    bannerStyle: 'color: red',
    consoleFunc: 'error',
  },
  warn: {
    prefix: '%cWARN',
    bannerStyle: 'color: yellow',
    consoleFunc: 'warn',
  },
  info: {
    prefix: '%cINFO',
    bannerStyle: 'color: white',
    consoleFunc: 'log',
  },
  debug: {
    prefix: '%cDEBUG',
    // color aero
    bannerStyle: 'color: #7CB9E8',
    consoleFunc: 'log',
  },
  trace: {
    prefix: '%cTRACE',
    bannerStyle: 'color: gray',
    consoleFunc: 'log',
  },
} satisfies Record<LogLevel, LogConfig>;

export class BrowserLogger extends BaseLogger implements RootLogger {
  private readonly buffer = {
    active: true,
    logs: [] as Log[],
  };

  private readonly transports = new Set<TransportLogger>();

  constructor(level: LogLevel = 'info', disableConsoleOutput = false) {
    super(
      pino({
        level: level,
        browser: {
          asObject: true,
          write(o) {
            const { time, level, module, ...log } = o as PinoLogWriteObject;
            const levelLabel = pino.levels.labels[level] as LogLevel;
            const config = logConfig[levelLabel];
            const logContent = log[0]?.length ? [log.msg, log[0]] : [log.msg];
            console[config.consoleFunc](
              config.prefix + commonLogConfig.message,
              config.bannerStyle,
              commonLogConfig.timeStyle,
              formatTime(time),
              commonLogConfig.moduleStyle,
              module ?? staticLoggerConfig.rootLoggerName,
              ...logContent
            );
          },
          transmit: {
            send: (_, logEvent) => {
              const names = logEvent.bindings.map((b): string => b['module']);
              const current = names.pop();
              if (current) {
                names.unshift(staticLoggerConfig.rootLoggerName);
              }
              const [[args], message] = logEvent.messages;

              const log: Log = {
                msg: message,
                data: args,
                meta: {
                  date: new Date(logEvent.ts),
                  logLevel: logEvent.level.label as LogLevel,
                  name: current ?? staticLoggerConfig.rootLoggerName,
                  parentNames: names,
                },
              };
              if (this.buffer.active) {
                this.buffer.logs.push(log);
              } else {
                this.transports.forEach(logger => logger(log));
              }
            },
          },
          disabled: disableConsoleOutput,
        },
      }),
      new Map()
    );

    this.loggerMap.set(staticLoggerConfig.rootLoggerName, this);
  }

  attachTransport(transportLogger: TransportLogger): void {
    if (this.buffer.active) {
      this.buffer.active = false;
      this.buffer.logs.forEach(log => transportLogger(log));
      this.buffer.logs = [];
    }
    this.transports.add(transportLogger);
  }
}
