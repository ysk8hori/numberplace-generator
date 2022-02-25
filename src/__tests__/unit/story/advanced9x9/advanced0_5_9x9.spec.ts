import TestDefiner from '../testDefiner';

describe('クラシック超上級お試し5', () => {
  const testDefiner = TestDefiner.create(
    '  4   7 3|8  9 2| 3| 891|5       8|     926|       2|   8 4  5|6 5   1',
    '124658793|857932416|936471852|289146537|561327948|743589261|418765329|392814675|675293184'
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
