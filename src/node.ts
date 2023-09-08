import type { LogLevel, RootLogger } from "./common/interface";
import { NodeLogger } from "./node/logger";

export type { IBaseLogger, RootLogger, LogLevel } from "./common/interface";

export function createRootLogger(logLevel: LogLevel, disableConsoleOutput?: boolean): RootLogger {
  return new NodeLogger(logLevel, disableConsoleOutput);
}