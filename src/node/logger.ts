import pino, { Logger } from 'pino';
import { RootLogger, LogLevel, staticLoggerConfig } from '../common/interface';
import { BaseLogger } from '../common/base-logger';

export class NodeLogger extends BaseLogger implements RootLogger {
  private children = new Map<string, Logger>();
  constructor(level: LogLevel = 'info', disableConsoleOutput = false) {
    super(
      pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
      new Map()
    );
    this.loggerMap.set(staticLoggerConfig.rootLoggerName, this);

    this.logger.level = level;
    if (disableConsoleOutput) {
      this.logger.level = 'silent';
    }
    this.logger.onChild = child => {
      const symbols = Object.getOwnPropertySymbols(child);
      const symbol = symbols.find(x => String(x).includes('chindings'));
      if (!symbol) {
        // keep in mind that this mingles with internals of `pino` and this could break with every release.
        // as it is not part of the public api
        this.logger.error(
          'Could not find child Symbol(pino.chindings), which is used to get the logger name'
        );
        return;
      }

      // @ts-ignore
      const chindings: string = child[symbol];
      const name = chindings
        .split(',')
        .filter(x => x.includes('module'))
        .map(x => x.split(':')[1].split('"')[1])
        .join('.');

      if (name === '') {
        this.logger.error(
          'Could not extract module name of child logger. Child chindings: ' +
          chindings
        );
        return;
      }
      this.children.set(name, child);
    };
  }

  override get logLevel(): LogLevel {
    return this.logger.level as LogLevel;
  }

  override set logLevel(level: LogLevel) {
    this.logger.level = level;
    this.children.forEach(x => (x.level = level));
  }

  attachTransport(): void {
    throw new Error('Transports are not implemented for the node logger');
  }
}
