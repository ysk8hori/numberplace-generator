import Range from '@/core/range';
import { pos } from '@/core/valueobject/cellPosition';
import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import { describe, test, expect } from 'vitest';

describe('range', () => {
  describe('fetchRowsInOrder', () => {
    test('範囲内のCellを、行ごとに纏めて、上から順番に返す', () => {
      const game = Game.create(BaseHeight.create(3), BaseWidth.create(3));
      const range = Range.create(game.gameId, [
        pos(0, 2),
        pos(2, 1),
        pos(0, 0),
        pos(1, 1),
        pos(0, 1),
        pos(1, 0),
        pos(1, 2),
        pos(2, 0),
        pos(2, 2),
      ]);
      const generated = range.fetchRowsInOrder();

      [
        [pos(0, 0), pos(0, 1), pos(0, 2)],
        [pos(1, 0), pos(1, 1), pos(1, 2)],
        [pos(2, 0), pos(2, 1), pos(2, 2)],
      ].forEach(positions => {
        const next = generated.next();
        expect(
          next.done ? undefined : next.value.map(cell => cell.position),
        ).toEqual(positions);
      });
    });
  });
});
