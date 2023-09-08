

export class ConsoleLogger {
  error(message: string, ...args: unknown[]) {
    this.log('error', message, args);
  }

  info(message: string, ...args: unknown[]) {
    this.log('log', message, args);
  }

  log(level: 'error' | 'log', message: string, args?: unknown[]) {
    console[level](message, args);
  }
}

