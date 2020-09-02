import TestDefiner from '../testDefiner';

describe('クラシック超上級お試し7', () => {
  let testDefiner = TestDefiner.create(
    ' 4   6 3|7   4   1|   8  9|  1     8| 2  3  6|3     1|  7  4|1   8   7| 6 3   2',
    '248196735|796543281|513872946|671425398|829731564|354968172|987254613|132689457|465317829'
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
