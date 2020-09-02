import GameID from '@/core/valueobject/gameId';
import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import CellPosition, { pos } from '@/core/valueobject/cellPosition';
import { vPos } from '@/core/valueobject/verticalPosition';
import { hPos } from '@/core/valueobject/horizontalPosition';
import LoadLogic from '@/core/logic/loadLogic';

describe('LoadLogic', () => {
  describe('クラシック中級1 85 9x9 中上級', () => {
    const input = `174392865
682715943
935468721
528176439
417839652
369254187
893541276
746923518
251687394`;
    let game: Game;
    const cellRepository = CellRepositoryImpl.create();
    beforeAll(() => {
      game = Game.create(BaseHeight.create(3), BaseWidth.create(3));
      LoadLogic.create(game.gameId).execute(input);
    });

    test.each`
      vPosi | hPosi | answer
      ${0}  | ${0}  | ${'1'}
      ${0}  | ${1}  | ${'7'}
      ${0}  | ${2}  | ${'4'}
      ${0}  | ${3}  | ${'3'}
      ${0}  | ${4}  | ${'9'}
      ${0}  | ${5}  | ${'2'}
      ${0}  | ${6}  | ${'8'}
      ${0}  | ${7}  | ${'6'}
      ${0}  | ${8}  | ${'5'}
      ${1}  | ${0}  | ${'6'}
      ${1}  | ${1}  | ${'8'}
      ${1}  | ${2}  | ${'2'}
      ${1}  | ${3}  | ${'7'}
      ${1}  | ${4}  | ${'1'}
      ${1}  | ${5}  | ${'5'}
      ${1}  | ${6}  | ${'9'}
      ${1}  | ${7}  | ${'4'}
      ${1}  | ${8}  | ${'3'}
      ${2}  | ${0}  | ${'9'}
      ${2}  | ${1}  | ${'3'}
      ${2}  | ${2}  | ${'5'}
      ${2}  | ${3}  | ${'4'}
      ${2}  | ${4}  | ${'6'}
      ${2}  | ${5}  | ${'8'}
      ${2}  | ${6}  | ${'7'}
      ${2}  | ${7}  | ${'2'}
      ${2}  | ${8}  | ${'1'}
      ${3}  | ${0}  | ${'5'}
      ${3}  | ${1}  | ${'2'}
      ${3}  | ${2}  | ${'8'}
      ${3}  | ${3}  | ${'1'}
      ${3}  | ${4}  | ${'7'}
      ${3}  | ${5}  | ${'6'}
      ${3}  | ${6}  | ${'4'}
      ${3}  | ${7}  | ${'3'}
      ${3}  | ${8}  | ${'9'}
      ${4}  | ${0}  | ${'4'}
      ${4}  | ${1}  | ${'1'}
      ${4}  | ${2}  | ${'7'}
      ${4}  | ${3}  | ${'8'}
      ${4}  | ${4}  | ${'3'}
      ${4}  | ${5}  | ${'9'}
      ${4}  | ${6}  | ${'6'}
      ${4}  | ${7}  | ${'5'}
      ${4}  | ${8}  | ${'2'}
      ${5}  | ${0}  | ${'3'}
      ${5}  | ${1}  | ${'6'}
      ${5}  | ${2}  | ${'9'}
      ${5}  | ${3}  | ${'2'}
      ${5}  | ${4}  | ${'5'}
      ${5}  | ${5}  | ${'4'}
      ${5}  | ${6}  | ${'1'}
      ${5}  | ${7}  | ${'8'}
      ${5}  | ${8}  | ${'7'}
      ${6}  | ${0}  | ${'8'}
      ${6}  | ${1}  | ${'9'}
      ${6}  | ${2}  | ${'3'}
      ${6}  | ${3}  | ${'5'}
      ${6}  | ${4}  | ${'4'}
      ${6}  | ${5}  | ${'1'}
      ${6}  | ${6}  | ${'2'}
      ${6}  | ${7}  | ${'7'}
      ${6}  | ${8}  | ${'6'}
      ${7}  | ${0}  | ${'7'}
      ${7}  | ${1}  | ${'4'}
      ${7}  | ${2}  | ${'6'}
      ${7}  | ${3}  | ${'9'}
      ${7}  | ${4}  | ${'2'}
      ${7}  | ${5}  | ${'3'}
      ${7}  | ${6}  | ${'5'}
      ${7}  | ${7}  | ${'1'}
      ${7}  | ${8}  | ${'8'}
      ${8}  | ${0}  | ${'2'}
      ${8}  | ${1}  | ${'5'}
      ${8}  | ${2}  | ${'1'}
      ${8}  | ${3}  | ${'6'}
      ${8}  | ${4}  | ${'8'}
      ${8}  | ${5}  | ${'7'}
      ${8}  | ${6}  | ${'3'}
      ${8}  | ${7}  | ${'9'}
      ${8}  | ${8}  | ${'4'}
    `('($vPosi, $hPosi)s answer is $answer', ({ vPosi, hPosi, answer }) => {
      expect(
        cellRepository
          .findByPosition(game.gameId, pos(vPosi, hPosi))
          .getAnswer()?.value
      ).toEqual(answer);
    });
  });
});
