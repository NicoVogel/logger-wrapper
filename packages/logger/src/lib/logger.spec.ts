import {describe, it, expect} from 'vitest'
import { logger } from './logger';

describe('logger', () => {
  it('should work', () => {
    expect(logger()).toEqual('logger');
  });
});
