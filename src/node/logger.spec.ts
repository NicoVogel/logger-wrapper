/**
 * `pino` writes directly into the `process.stdout` and therefore we can't mock the console object to see if it is working.
 * A solution is presented here: https://nikhilvijayan.com/testing-stdout-in-node-js-jest/
 *
 * TODO: implement sub process and listen to output
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { NodeLogger } from './logger';

describe('node logger', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  });

  afterAll(() => {
    vi.useRealTimers()
  });

  it('should create logger', () => {
    expect(async () => {
      const logger = new NodeLogger();

      expect(logger).toBeDefined();
    }).not.toThrow();
  });

  it('should log to console', async () => {
    const logger = new NodeLogger();
    logger.error('test log');

    vi.runAllTimers();

    // TODO: implement
    // expect(subprocess.output).toContain('test log');
  });

  describe('subLogger', () => {
    it('should create sub logger', async () => {
      const topLogger = new NodeLogger();

      expect(() => {
        const childLogger = topLogger.subLogger('sub logger');

        expect(childLogger).toBeDefined();
      }).not.toThrow();
    });

    it('should return the same instance when called twice with the same name', () => {
      const topLogger = new NodeLogger();
      const subLoggerA = topLogger.subLogger('any name');
      const subLoggerB = topLogger.subLogger('any name');

      expect(subLoggerA).toBe(subLoggerB);
    });

    it('should return a different instance for different names', () => {
      const topLogger = new NodeLogger();
      const subLoggerA = topLogger.subLogger('any name');
      const subLoggerB = topLogger.subLogger('any other name');

      expect(subLoggerA).not.toBe(subLoggerB);
    });
  });

  describe('log level', () => {
    it('should not log if below log level', () => {
      const logger = new NodeLogger('error');
      logger.warn('test log');
      vi.runAllTimers();

      // TODO: implement
      // expect(subprocess.output).toContain('test log');
    });

    it('sub logger has same log level as parent', () => {
      const topLogger = new NodeLogger('error');
      const subLogger = topLogger.subLogger('child');

      expect(subLogger.logLevel).toBe('error');
    });

    it('should apply log level change to sub loggers', () => {
      const topLogger = new NodeLogger('error');
      const subLogger = topLogger.subLogger('child');

      topLogger.logLevel = 'warn';

      expect(subLogger.logLevel).toBe('warn');
    });

    it('sub logger log level change does not affect parent', () => {
      const topLogger = new NodeLogger('error');
      const subLogger = topLogger.subLogger('child');

      subLogger.logLevel = 'warn';

      expect(topLogger.logLevel).toBe('error');
    });

    it('should produce log if only sub level logger is of lower log level', () => {
      const topLogger = new NodeLogger('error');
      const subLogger = topLogger.subLogger('child');
      subLogger.logLevel = 'warn';

      subLogger.warn('test log');
      vi.runAllTimers();

      // TODO: implement
      // expect(subprocess.output).toContain('test log');
    });
  });

  describe('getLogger', () => {
    it('should null if the logger does not exist', () => {
      const topLogger = new NodeLogger();
      const logger = topLogger.getLogger('any name');

      expect(logger).toBeUndefined();
    });

    it('should return existing logger instance', () => {
      const topLogger = new NodeLogger();
      topLogger.subLogger('any name');
      const logger = topLogger.getLogger('any name');

      expect(logger).toBeDefined();
    });
  });
});
