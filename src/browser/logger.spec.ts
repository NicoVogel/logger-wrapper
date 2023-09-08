import { Mock, afterEach, describe, expect, it, vi, } from 'vitest';
import { TransportLogger } from '../common/interface';
import { BrowserLogger } from './logger';

const mockConsole = {
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
}
vi.stubGlobal('console', mockConsole)

type FN<T extends (...args: any[]) => any> = Mock<Parameters<T>, ReturnType<T>>

function getLogContent(
  func: 'error' | 'warn' | 'log'
) {
  const data: unknown[] = mockConsole[func].mock.lastCall
  const numberOfArgumentsBeforeActualData = 6;

  return data.splice(numberOfArgumentsBeforeActualData);
}

describe('browser logger', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create logger', () => {
    expect(() => {
      const logger = new BrowserLogger();

      expect(logger).toBeDefined();
    }).not.toThrow();
  });

  it('should log to console', () => {
    const logger = new BrowserLogger();
    logger.error('test log');

    expect(console.error).toHaveBeenCalled();
  });

  describe('logging', () => {
    it('should log message', () => {
      const logger = new BrowserLogger();
      logger.info('test log');

      expect(getLogContent('log')).toEqual(['test log']);
    });

    it('should log both message and data', () => {
      const logger = new BrowserLogger();
      logger.info('test log', { some: 'data' });

      expect(getLogContent('log')).toEqual([
        'test log',
        [{ some: 'data' }],
      ]);
    });

    it('should log both message and multiple data', () => {
      const logger = new BrowserLogger();
      logger.info('test log', { some: 'data' }, 'some other data');

      expect(getLogContent('log')).toEqual([
        'test log',
        [{ some: 'data' }, 'some other data'],
      ]);
    });
  });

  describe('attachTransport', () => {



    it('should trigger attachTransport function', () => {
      const logger = new BrowserLogger();
      const { mockTransport } = attachMockTransport(logger)

      logger.error('test log');

      expect(mockTransport).toHaveBeenCalled();
    });

    it('should trigger attachTransport function, even if log was emitted from child', () => {
      const topLogger = new BrowserLogger();
      const childLogger = topLogger.subLogger('sub logger');
      const { mockTransport } = attachMockTransport(topLogger)

      childLogger.error('test log');

      expect(mockTransport).toHaveBeenCalledTimes(1);
    });

    it('should contain log message', () => {
      const logger = new BrowserLogger();
      const { getFirstLog } = attachMockTransport(logger)

      logger.error('test log');
      const log = getFirstLog()

      expect(log.msg).toBe('test log');
    });

    it('should contain log message and data', () => {
      const logger = new BrowserLogger();
      const { getFirstLog } = attachMockTransport(logger)
      const randomData = { someData: 'some value' };

      logger.error('test log', randomData);
      const log = getFirstLog();

      expect(log.msg).toBe('test log');
      expect(log.data).toEqual([randomData]);
    });

    it('should contain log message and all data', () => {
      const logger = new BrowserLogger();
      const { getFirstLog } = attachMockTransport(logger)
      const randomData = { someData: 'some value' };
      const randomArray = ['first', 1];

      logger.error('test log', randomData, randomArray);
      const log = getFirstLog();

      expect(log.msg).toBe('test log');
      expect(log.data).toEqual([randomData, randomArray]);
    });

    it('should provide log level in meta data', () => {
      const logger = new BrowserLogger('warn');
      const { getFirstLog } = attachMockTransport(logger)

      logger.error('test log');
      const log = getFirstLog();

      expect(log.meta.logLevel).toBe('error');
    });

    it('should show "root" as logger name in the transport metadata', () => {
      const logger = new BrowserLogger();
      const { getFirstLog } = attachMockTransport(logger)

      logger.error('test log');
      const log = getFirstLog();

      expect(log.meta.name).toBe('root');
    });

    it('should show parent loggers correctly in transport metadata', () => {
      const topLogger = new BrowserLogger();
      const firstLogger = topLogger.subLogger('first sub logger');
      const secondLogger = firstLogger.subLogger('second sub logger');
      const { getFirstLog } = attachMockTransport(topLogger)

      secondLogger.error('test log');
      const log = getFirstLog();

      expect(log.meta.parentNames).toEqual(['root', 'first sub logger']);
    });
  });

  describe('subLogger', () => {
    it('should create sub logger', () => {
      const topLogger = new BrowserLogger();

      expect(() => {
        const childLogger = topLogger.subLogger('sub logger');

        expect(childLogger).toBeDefined();
      }).not.toThrow();
    });

    it('should add its name to the transport logger meta data', () => {
      const topLogger = new BrowserLogger();
      const childLogger = topLogger.subLogger('sub logger');
      const { getFirstLog } = attachMockTransport(topLogger)

      childLogger.error('test log');
      const log = getFirstLog();

      expect(log.meta.name).toBe('sub logger');
    });

    it('should consider sub of sub logger in the transporter', () => {
      const topLogger = new BrowserLogger();
      const firstChild = topLogger.subLogger('first child');
      const secondChild = firstChild.subLogger('second child');
      const { mockTransport } = attachMockTransport(topLogger)

      secondChild.error('test log');

      expect(mockTransport).toHaveBeenCalledTimes(1);
    });

    it('should return the same instance when called twice with the same name', () => {
      const topLogger = new BrowserLogger();
      const subLoggerA = topLogger.subLogger('any name');
      const subLoggerB = topLogger.subLogger('any name');

      expect(subLoggerA).toBe(subLoggerB);
    });

    it('should return a different instance for different names', () => {
      const topLogger = new BrowserLogger();
      const subLoggerA = topLogger.subLogger('any name');
      const subLoggerB = topLogger.subLogger('any other name');

      expect(subLoggerA).not.toBe(subLoggerB);
    });
  });

  describe('buffer', () => {
    it('should buffer messages until the first logger is registered', () => {
      const logger = new BrowserLogger();
      logger.error('test log');

      const { mockTransport } = attachMockTransport(logger)

      expect(mockTransport).toHaveBeenCalledTimes(1);
    });
  });

  describe('log level', () => {
    it('should not log if below log level', () => {
      const logger = new BrowserLogger('error');
      logger.warn('test log');

      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('sub logger has same log level as parent', () => {
      const topLogger = new BrowserLogger('error');
      const subLogger = topLogger.subLogger('child');

      expect(subLogger.logLevel).toBe('error');
    });

    it('should apply log level change to sub loggers', () => {
      const topLogger = new BrowserLogger('error');
      const subLogger = topLogger.subLogger('child');

      topLogger.logLevel = 'warn';

      expect(subLogger.logLevel).toBe('warn');
    });

    it('sub logger log level change does not affect parent', () => {
      const topLogger = new BrowserLogger('error');
      const subLogger = topLogger.subLogger('child');

      subLogger.logLevel = 'warn';

      expect(topLogger.logLevel).toBe('error');
    });
  });

  describe('getLogger', () => {
    it('should null if the logger does not exist', () => {
      const topLogger = new BrowserLogger();
      const logger = topLogger.getLogger('any name');

      expect(logger).toBeUndefined();
    });

    it('should return existing logger instance', () => {
      const topLogger = new BrowserLogger();
      topLogger.subLogger('any name');
      const logger = topLogger.getLogger('any name');

      expect(logger).toBeDefined();
    });
  });
});


function attachMockTransport(logger: BrowserLogger) {
  const mockTransport: FN<TransportLogger> = vi.fn()
  logger.attachTransport(mockTransport);
  return {
    mockTransport,
    getFirstLog: () => {
      const [log] = mockTransport.mock.calls[0];
      return log
    }
  }
}