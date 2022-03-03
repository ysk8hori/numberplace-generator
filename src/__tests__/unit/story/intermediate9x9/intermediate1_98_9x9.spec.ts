import TestDefiner from '../testDefiner';
import { describe } from 'vitest';

describe('クラシック中級1', () => {
  describe('中上級98', () => {
    const testDefiner = TestDefiner.create(
      '7  4 1  9| 62    3|   2   1|5     3 8||9 4     2| 7   9| 5    84|3  8 7  6',
      '735461289|162985734|498273615|527194368|683752491|914638572|876549123|259316847|341827956',
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
