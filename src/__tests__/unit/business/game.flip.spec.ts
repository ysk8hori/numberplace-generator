import Game from '@/core/entity/game';
import LoadLogic from '@/core/logic/loadLogic';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellPosition from '@/core/valueobject/cellPosition';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import { describe, expect, it } from 'vitest';

describe('Game.flip', () => {
  const cellRepository = CellRepositoryImpl.create();
  const game = Game.create(BaseHeight.create(1), BaseWidth.create(3));
  LoadLogic.create(game.gameId).execute('123|231|312', {
    rowSplitter: '|',
  });
  const fliped = game.fliped();
  const flipedCells = cellRepository.findAll(fliped.gameId);
  /*
123
231
312
は
213
132
321
になる
*/
  describe.each([
    [0, 0, '2'],
    [0, 1, '1'],
    [0, 2, '3'],
    [1, 0, '1'],
    [1, 1, '3'],
    [1, 2, '2'],
    [2, 0, '3'],
    [2, 1, '2'],
    [2, 2, '1'],
  ])('', (x, y, answer) => {
    it(`pos(${x}, ${y}) は ${answer}`, () => {
      expect(
        flipedCells.find(cell => cell.isSamePosition(CellPosition.c(x, y)))
          ?.answer?.value,
      ).toEqual(answer);
    });
  });
});
