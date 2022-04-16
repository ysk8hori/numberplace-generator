import TestDefiner from '../testDefiner';
import { describe } from 'vitest';

describe('クロス 9x9', () => {
  const testDefiner = TestDefiner.create(
    ' 3 7|7 2  4| 8|5   2  6|   3 1| 6  4   3|       9|   2  5 4|     8 7',
    '436785912|792614385|185932746|543829167|278361459|961547823|654173298|817296534|329458671',
    3,
    3,
    ['cross'],
  );
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
