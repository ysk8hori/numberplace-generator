import { generateGame } from '@/index';
import { expect, test } from 'vitest';

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

test('一辺のサイズが17を超える問題を生成できない', () => {
  expect(() => generateGame({ width: 1, height: 17 })).toThrowError();
});

test('一辺のサイズが3より小さい問題を生成できない', () => {
  expect(() => generateGame({ width: 1, height: 2 })).toThrowError();
});
