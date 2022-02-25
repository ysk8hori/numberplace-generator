import TestDefiner from '../testDefiner';

describe('クラシック中級1', () => {
  describe('中上級97', () => {
    const testDefiner = TestDefiner.create(
      ' 1  7  8|2     7 1|    43 5|      6|1 8   4 2|  7| 2 48|3 5     4| 7  1  2',
      '416572983|253968741|789143256|542731698|138659472|697824135|921485367|365297814|874316529'
    );
    testDefiner.defineBeforeAll();
    testDefiner.defineTests();
  });
});
