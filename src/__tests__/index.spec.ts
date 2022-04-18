import { generateGame } from '@/index';
import { expect, test, describe } from 'vitest';

test('一辺のサイズが9のスタンダードな問題を生成できる', () => {
  const [pazzules, corrected] = generateGame({ width: 3, height: 3 });
  expect(pazzules.cells.length).toBe(81);
  expect(corrected.cells.length).toBe(81);
});

test('一辺のサイズが3の小さな問題を生成できる', () => {
  const [pazzules, corrected] = generateGame({ width: 3, height: 1 });
  expect(pazzules.cells.length).toBe(9);
  expect(corrected.cells.length).toBe(9);
});

describe.each([
  { width: 3, height: 2 },
  { width: 3, height: 3 },
  { width: 4, height: 3 },
])('', blockSize => {
  test(`${JSON.stringify(blockSize)}のクロスの問題を生成できる`, () => {
    const [_, corrected] = generateGame(blockSize, {
      gameTypes: ['cross'],
    });
    const leftups = corrected.cells
      .filter(c => c.pos[0] === c.pos[1])
      .map(c => c.answer);
    const set = new Set(leftups);
    expect(leftups.length).toBe(set.size);
    const rightups = corrected.cells
      .filter(
        c => c.pos[0] === blockSize.width * blockSize.height - c.pos[1] - 1,
      )
      .map(c => c.answer);
    const set2 = new Set(rightups);
    expect(rightups.length).toBe(set2.size);
  });
});

test('一辺のサイズが17を超える問題を生成できない', () => {
  expect(() => generateGame({ width: 1, height: 17 })).toThrowError();
});

test('一辺のサイズが3より小さい問題を生成できない', () => {
  expect(() => generateGame({ width: 1, height: 2 })).toThrowError();
});
