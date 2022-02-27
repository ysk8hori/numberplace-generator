import TestDefiner from '../testDefiner';
import { describe } from 'vitest';

describe('クラシック中級1', () => {
  describe('中上級99', () => {
    const testDefiner = TestDefiner.create(
      '    8|5  2 4  6| 26   34| 7     1|4       8| 3     5| 97   12|1  6 7  5|    4',
      '743186592|519234786|826795341|978562413|465319278|231478659|697853124|184627935|352941867'
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
