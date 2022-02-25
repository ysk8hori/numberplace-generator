import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import OutputAnswerStringLogic from '@/core/logic/outputAnswerStringLogic';
import { createGoodGame } from '@/core/logic/create/createGoodGame';
import GameID from '@/core/valueobject/gameId';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';

describe('CreateGameLogic', () => {
  describe('1x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = createGoodGame({
        baseHeight: BaseHeight.create(1),
        baseWidth: BaseWidth.create(3),
      });
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length
      ).toBeLessThan(10 / 2 + 5);
    });
    test('GameRepositoryの件数', () => {
      expect(GameRepositoryImpl.games.length).toBe(1);
    });
  });
  describe('2x2(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = createGoodGame({
        baseHeight: BaseHeight.create(2),
        baseWidth: BaseWidth.create(2),
      });
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length
      ).toBeLessThan(17 / 2 + 5);
    });
  });
  describe('2x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = createGoodGame({
        baseHeight: BaseHeight.create(2),
        baseWidth: BaseWidth.create(3),
      });
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length
      ).toBeLessThan(37 / 2 + 5);
    });
  });
  describe('3x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = createGoodGame({
        baseHeight: BaseHeight.create(3),
        baseWidth: BaseWidth.create(3),
      });
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length
      ).toBeLessThan(82 / 2 + 5);
    });
  });
});
