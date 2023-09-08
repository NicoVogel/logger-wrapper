// both import styles do not work
import pino from "pino";
// import {pino} from "pino";

type PinoLogWriteObject = {
  level: number;
  module: string | undefined;
  msg: string;
  time: number;
  0?: unknown[];
};

function formatTime(ts: number) {
  const date = new Date(ts);
  return `${date.toLocaleTimeString().split(" ")[0]}.${date.getMilliseconds()}`;
}

const commonLogConfig = {
  timeStyle: "color: white",
  moduleStyle: "font-weight: bold; color: yellow",
  message: " %c[%s] %c%s",
} as const;

/**
 * use `%c` to apply css rules to the console output
 * source: https://developer.chrome.com/docs/devtools/console/format-style/
 */
const logConfig = {
  error: {
    prefix: "%cERROR",
    bannerStyle: "color: red",
    consoleFunc: "error",
  },
  warn: {
    prefix: "%cWARN",
    bannerStyle: "color: yellow",
    consoleFunc: "warn",
  },
  info: {
    prefix: "%cINFO",
    bannerStyle: "color: white",
    consoleFunc: "log",
  },
  debug: {
    prefix: "%cDEBUG",
    // color aero
    bannerStyle: "color: #7CB9E8",
    consoleFunc: "log",
  },
  trace: {
    prefix: "%cTRACE",
    bannerStyle: "color: gray",
    consoleFunc: "log",
  },
} as const;

export class BrowserLogger {
  private logger;
  constructor() {
    this.logger = pino({
      level: "trace",
      browser: {
        asObject: true,
        write(o) {
          const { time, level, module, ...log } = o as PinoLogWriteObject;
          const levelLabel = pino.levels.labels[level];
          const config = logConfig[levelLabel];
          const logContent = log[0]?.length ? [log.msg, log[0]] : [log.msg];
          console[config.consoleFunc](
            config.prefix + commonLogConfig.message,
            config.bannerStyle,
            commonLogConfig.timeStyle,
            formatTime(time),
            commonLogConfig.moduleStyle,
            module ?? "root",
            ...logContent
          );
        },
      },
    });
  }
  error(message: string, ...args: unknown[]) {
    this.log("error", message, args);
  }

  info(message: string, ...args: unknown[]) {
    this.log("log", message, args);
  }

  log(level: "error" | "log", message: string, args?: unknown[]) {
    this.logger[level](message, args);
  }
}
