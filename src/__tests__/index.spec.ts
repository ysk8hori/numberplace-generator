import { generateGame } from '@/index';
import { expect, test } from 'vitest';

test('createGame', () => {
  const [pazzules, corrected] = generateGame({ width: 3, height: 3 });
  expect(pazzules.cells.length).toBe(81);
  expect(corrected.cells.length).toBe(81);
});
