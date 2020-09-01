import TestDefiner from '../testDefiner';

describe('クラシック超上級お試し6', () => {
  let testDefiner = TestDefiner.create(
    '  4  37|9  82   6|  7   9|6      8| 1  3  2| 9      5|  9   1|1   42  3|  85  2',
    '584693712|931827546|267154938|642975381|715438629|893261475|429386157|156742893|378519264'
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
