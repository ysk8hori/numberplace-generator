import TestDefiner from '../testDefiner';
import { describe } from 'vitest';

describe('クラシック中級1', () => {
  describe('中上級16', () => {
    const testDefiner = TestDefiner.create(
      ' 7     6 |6   1   3|  54 87  |  8   4  | 1  3  5 |  9   1  |  35 12  |7   2   8| 5     9 ',
      '174392865|682715943|935468721|528176439|417839652|369254187|893541276|746923518|251687394',
      3,
      3
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
