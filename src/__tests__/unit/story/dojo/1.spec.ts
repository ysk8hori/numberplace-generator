import TestDefiner from '../testDefiner';
import { describe } from 'vitest';

describe('道場1', () => {
  const testDefiner = TestDefiner.create(
    ' 6  5 4|8  49 3| 2 1   9|   3  8|7       1|  6  4| 7   3 8|  5 72  6|  9 4  2',
    '963258417|851497362|427136598|592361874|748529631|136784259|274613985|385972146|619845723',
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
