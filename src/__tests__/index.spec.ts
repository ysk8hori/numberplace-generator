import GroupFactory from '@/core/factory/groupFactory';
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
    // 左上から右下にかけて斜めのグループのセルの数字が一意であること
    const leftups = corrected.cells
      .filter(c => c.pos[0] === c.pos[1])
      .map(c => c.answer);
    const set = new Set(leftups);
    expect(leftups.length).toBe(set.size);
    // 右上から左下にかけて斜めのグループのセルの数字が一意であること
    const rightups = corrected.cells
      .filter(
        c => c.pos[0] === blockSize.width * blockSize.height - c.pos[1] - 1,
      )
      .map(c => c.answer);
    const set2 = new Set(rightups);
    expect(rightups.length).toBe(set2.size);
  });
});

describe(`{ width: 3, height: 3}の HYPER の問題を生成できる`, () => {
  console.time('hyper');
  const [puzzle, corrected] = generateGame(
    { width: 3, height: 3 },
    {
      gameTypes: ['hyper'],
    },
  );
  console.timeEnd('hyper');
  describe.each([0, 1, 2, 3])('', groupNo => {
    test(`HYPERグループ${groupNo}の数字が一意であること`, () => {
      GroupFactory.HYPER_GROUP_POSITIONS[groupNo].map(pos =>
        corrected.cells.find(
          cell =>
            pos.horizontalPosition.value === cell.pos[0] &&
            pos.verticalPosition.value === cell.pos[1],
        ),
      );
      const group1 = corrected.cells
        .filter(cell =>
          GroupFactory.HYPER_GROUP_POSITIONS[0].some(
            pos =>
              pos.horizontalPosition.value === cell.pos[0] &&
              pos.verticalPosition.value === cell.pos[1],
          ),
        )
        .map(cell => cell.answer);
      const set1 = new Set(group1);
      expect(group1.length).toBe(set1.size);
    });
  });
});

describe(`{ width: 3, height: 3}の hyper x cross の問題を生成できる`, () => {
  console.time('hyper x cross');
  const [puzzle, corrected] = generateGame(
    { width: 3, height: 3 },
    {
      gameTypes: ['hyper', 'cross'],
    },
  );
  console.timeEnd('hyper x cross');
  describe.each([0, 1, 2, 3])('', groupNo => {
    test(`HYPERグループ${groupNo}の数字が一意であること`, () => {
      GroupFactory.HYPER_GROUP_POSITIONS[groupNo].map(pos =>
        corrected.cells.find(
          cell =>
            pos.horizontalPosition.value === cell.pos[0] &&
            pos.verticalPosition.value === cell.pos[1],
        ),
      );
      const group1 = corrected.cells
        .filter(cell =>
          GroupFactory.HYPER_GROUP_POSITIONS[0].some(
            pos =>
              pos.horizontalPosition.value === cell.pos[0] &&
              pos.verticalPosition.value === cell.pos[1],
          ),
        )
        .map(cell => cell.answer);
      const set1 = new Set(group1);
      expect(group1.length).toBe(set1.size);
    });
  });
  test(`左上から右下にかけて斜めのグループのセルの数字が一意であること`, () => {
    const leftups = corrected.cells
      .filter(c => c.pos[0] === c.pos[1])
      .map(c => c.answer);
    const set = new Set(leftups);
    expect(leftups.length).toBe(set.size);
  });
  test(`右上から左下にかけて斜めのグループのセルの数字が一意であること`, () => {
    const rightups = corrected.cells
      .filter(c => c.pos[0] === 9 - c.pos[1] - 1)
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
