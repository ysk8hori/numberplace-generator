import TestDefiner from './testDefiner';

describe.skip('白紙から作る', () => {
  const testDefiner = TestDefiner.create('', '', 2, 3);
  testDefiner.defineBeforeAll();
  testDefiner.defineTests();
});
