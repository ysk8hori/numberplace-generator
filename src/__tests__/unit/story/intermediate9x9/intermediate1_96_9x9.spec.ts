import TestDefiner from '../testDefiner';

describe('クラシック中級1', () => {
  describe('中上級96', () => {
    let testDefiner = TestDefiner.create(
      '4       1| 5   1 4 |  8 476  | 79|  3 7 2|      59|  681 9| 4 9   7|2       5',
      '462593781|957681342|318247659|679152438|583479216|124368597|736815924|845926173|291734865'
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
