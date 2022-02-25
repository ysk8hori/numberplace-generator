import Range from '@/core/range';
import CellPosition from '@/core/valueobject/cellPosition';
import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

describe('range', () => {
  describe('fetchRowsInOrder', () => {
    describe('a', () => {
      const game = Game.create(BaseHeight.create(3), BaseWidth.create(3));
      const range = Range.create(game.gameId, [
        CellPosition.createFromNumber(2, 0),
        CellPosition.createFromNumber(1, 2),
        CellPosition.createFromNumber(0, 0),
        CellPosition.createFromNumber(1, 1),
        CellPosition.createFromNumber(1, 0),
        CellPosition.createFromNumber(0, 1),
        CellPosition.createFromNumber(2, 1),
        CellPosition.createFromNumber(0, 2),
        CellPosition.createFromNumber(2, 2),
      ]);
      const generated = range.fetchRowsInOrder();

      test.each`
        row  | positions
        ${0} | ${[CellPosition.createFromNumber(0, 0), CellPosition.createFromNumber(1, 0), CellPosition.createFromNumber(2, 0)]}
        ${1} | ${[CellPosition.createFromNumber(0, 1), CellPosition.createFromNumber(1, 1), CellPosition.createFromNumber(2, 1)]}
        ${2} | ${[CellPosition.createFromNumber(0, 2), CellPosition.createFromNumber(1, 2), CellPosition.createFromNumber(2, 2)]}
      `("row $row 's CellPositions", ({ positions }) => {
        const next = generated.next();
        expect(
          next.done ? undefined : next.value.map(cell => cell.position)
        ).toEqual(positions);
      });
    });
  });
});
