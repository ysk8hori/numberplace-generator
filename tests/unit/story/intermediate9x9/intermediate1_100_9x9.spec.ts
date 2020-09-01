import TestDefiner from '../testDefiner';

describe('クラシック中級1', () => {
  describe('中上級100', () => {
    let testDefiner = TestDefiner.create(
      '6 3  8  1|   5  2  | 5   1  8|2 6    4 |    2| 8    7 9|9  8   6 |  2  5   |3  7  4 5',
      '623478951|718569234|459231678|296187543|537924816|184356729|975843162|842615397|361792485'
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
