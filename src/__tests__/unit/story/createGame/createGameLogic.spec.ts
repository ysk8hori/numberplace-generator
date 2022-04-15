import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import OutputAnswerStringLogic from '@/core/logic/outputAnswerStringLogic';
import CreateGoodGameLogic from '@/core/logic/create/createGoodGameLogic';
import GameID from '@/core/valueobject/gameId';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';
import { describe, test, expect, beforeAll, it } from 'vitest';

describe('CreateGameLogic', () => {
  describe('1x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(1),
        BaseWidth.create(3),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(10 / 2 + 5);
    });
    test('GameRepositoryの件数', () => {
      expect(GameRepositoryImpl.games.length).toBe(1);
    });
  });
  describe('2x2(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(2),
        BaseWidth.create(2),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(17 / 2 + 5);
    });
  });
  describe('2x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(2),
        BaseWidth.create(3),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(37 / 2 + 5);
    });
  });
  describe('3x3(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(3),
        BaseWidth.create(3),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(82 / 2 + 5);
    });
  });
  describe('3x4(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(3),
        BaseWidth.create(4),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log('12*12のパズル');
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(144 / 2 + 5);
    });
  });
  describe('4x4(base)', () => {
    let gameId: GameID;
    beforeAll(() => {
      gameId = CreateGoodGameLogic.create(
        BaseHeight.create(4),
        BaseWidth.create(4),
      ).execute();
    });
    it('解答済みのセル数が全セル数の半分より少ないこと', () => {
      console.log('16*16のパズル');
      console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
      expect(
        CellRepositoryImpl.create()
          .findAll(gameId)
          .filter(cell => cell.isAnswered).length,
      ).toBeLessThan(256 / 2 + 5);
    });
  });

  // describe('3x4(base)', () => {
  //   let gameId: GameID;
  //   beforeAll(() => {
  //     gameId = CreateGoodGameLogic.create(
  //       BaseHeight.create(3),
  //       BaseWidth.create(4)
  //     ).execute();
  //   });
  //   it('解答済みのセル数が全セル数の半分より少ないこと', () => {
  //     console.log(OutputAnswerStringLogic.create(gameId).getAnswerString());
  //     expect(
  //       CellRepositoryImpl.create()
  //         .findAll(gameId)
  //         .filter(cell => cell.isAnswered).length
  //     ).toBeLessThan(265 / 2);
  //   });
  // });
});
