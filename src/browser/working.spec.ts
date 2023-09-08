import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserLogger } from './working';

const mockConsole = {
  error: vi.fn(),
  log: vi.fn()
}
vi.stubGlobal('console', mockConsole)


function getLogContent(func: 'error' | 'log') {
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
});