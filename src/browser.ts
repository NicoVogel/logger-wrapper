import type { LogLevel, RootLogger } from "./common/interface";
import { BrowserLogger } from "./browser/working";

export type { IBaseLogger, RootLogger, LogLevel, TransportLogger, Log } from "./common/interface";

export function createRootLogger(logLevel: LogLevel, disableConsoleOutput?: boolean): RootLogger {
  return new BrowserLogger(logLevel, disableConsoleOutput);
}