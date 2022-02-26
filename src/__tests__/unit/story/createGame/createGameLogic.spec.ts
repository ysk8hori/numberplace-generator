import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import { createGoodGame } from '@/core/logic/create/createGoodGame';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';

describe('CreateGameLogic', () => {
  describe('1x3(base)', () => {
    test('解答済みのセル数が全セル数の半分より少ないこと', () => {
      const game = createGoodGame({
        baseHeight: BaseHeight.create(1),
        baseWidth: BaseWidth.create(3),
      });
      expect(game.answeredCellCount).toBeLessThan(10 / 2 + 5);
    });
    test('GameRepositoryの件数', () => {
      expect(GameRepositoryImpl.games.length).toBe(1);
    });
  });
  describe('2x2(base)', () => {
    test('解答済みのセル数が全セル数の半分より少ないこと', () => {
      const game = createGoodGame({
        baseHeight: BaseHeight.create(2),
        baseWidth: BaseWidth.create(2),
      });
      expect(game.answeredCellCount).toBeLessThan(17 / 2 + 5);
    });
  });
  describe('2x3(base)', () => {
    test('解答済みのセル数が全セル数の半分より少ないこと', () => {
      const game = createGoodGame({
        baseHeight: BaseHeight.create(2),
        baseWidth: BaseWidth.create(3),
      });
      expect(game.answeredCellCount).toBeLessThan(37 / 2 + 5);
    });
  });
  describe('3x3(base)', () => {
    test('解答済みのセル数が全セル数の半分より少ないこと', () => {
      const game = createGoodGame({
        baseHeight: BaseHeight.create(2),
        baseWidth: BaseWidth.create(3),
      });
      expect(game.answeredCellCount).toBeLessThan(82 / 2 + 5);
    });
  });
});
