import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellPosition from '@/core/valueobject/cellPosition';
import Answer from '@/core/valueobject/answer';
import FillOwnAnswerIfLastOneAnswerCandidate from '@/core/logic/analyze/fillOwnAnswerIfLastOneAnswerCandidateLogic';
import { describe, it, beforeAll, expect } from 'vitest';

describe('FillLonelyLogic', () => {
  describe('候補が一つになった際に、自動的に答えが決まるかを検証する1', () => {
    const game = Game.create(BaseHeight.create(2), BaseWidth.create(3));
    beforeAll(() => {
      game.fill(CellPosition.createFromNumber(0, 0), Answer.create('1'));
      game.fill(CellPosition.createFromNumber(1, 0), Answer.create('2'));
      game.fill(CellPosition.createFromNumber(2, 0), Answer.create('3'));
      game.fill(CellPosition.createFromNumber(3, 0), Answer.create('4'));
      game.fill(CellPosition.createFromNumber(4, 0), Answer.create('5'));
    });
    it('{5,0}のCellに６が解答されていること', () => {
      expect(game.getAnswer(CellPosition.createFromNumber(5, 0))).toEqual(
        Answer.create('6'),
      );
    });
  });
  describe('候補が一つになった際に、自動的に答えが決まるかを検証する2', () => {
    const game = Game.create(BaseHeight.create(2), BaseWidth.create(3));
    beforeAll(() => {
      game.fill(CellPosition.createFromNumber(0, 0), Answer.create('1'));
      game.fill(CellPosition.createFromNumber(0, 1), Answer.create('2'));
      game.fill(CellPosition.createFromNumber(0, 2), Answer.create('3'));
      game.fill(CellPosition.createFromNumber(0, 3), Answer.create('4'));
      game.fill(CellPosition.createFromNumber(0, 4), Answer.create('5'));
    });
    it('{0,5}のCellに６が解答されていること', () => {
      expect(game.getAnswer(CellPosition.createFromNumber(0, 5))).toEqual(
        Answer.create('6'),
      );
    });
  });
  describe('候補が一つになった際に、自動的に答えが決まるかを検証する3（これはfillLonelyLogicに関係ない）', () => {
    const game = Game.create(BaseHeight.create(3), BaseWidth.create(3));
    beforeAll(() => {
      game.fill(CellPosition.createFromNumber(2, 0), Answer.create('1'));
      game.fill(CellPosition.createFromNumber(2, 1), Answer.create('2'));
      game.fill(CellPosition.createFromNumber(2, 3), Answer.create('4'));
      game.fill(CellPosition.createFromNumber(2, 4), Answer.create('5'));
      game.fill(CellPosition.createFromNumber(6, 5), Answer.create('6'));
      game.fill(CellPosition.createFromNumber(7, 5), Answer.create('7'));
      game.fill(CellPosition.createFromNumber(0, 3), Answer.create('8'));
      game.fill(CellPosition.createFromNumber(1, 4), Answer.create('3'));
      FillOwnAnswerIfLastOneAnswerCandidate.create(game.gameId).execute();
    });
    it('{0,5}のCellに9が解答されていること', () => {
      expect(game.getAnswer(CellPosition.createFromNumber(2, 5))).toEqual(
        Answer.create('9'),
      );
    });
  });
});
