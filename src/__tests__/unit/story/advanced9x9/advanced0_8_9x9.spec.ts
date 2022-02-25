import TestDefiner from '../testDefiner';

describe('クラシック超上級お試し8', () => {
  const testDefiner = TestDefiner.create(
    '5 2 9 1|   1   8|3    6  2| 4    7|6       1|  5    9|9  7    4| 6   3|  7 2 5 3',
    '582397146|496152387|371486952|148639725|629875431|735241698|953768214|264513879|817924563'
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
