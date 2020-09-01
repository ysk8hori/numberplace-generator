import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellPosition from '@/core/valueobject/cellPosition';
import { vPos } from '@/core/valueobject/verticalPosition';
import { hPos } from '@/core/valueobject/horizontalPosition';
import Answer from '@/core/valueobject/answer';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';

describe('AnswerLogic', () => {
  let game: Game;
  const cellRepository = CellRepositoryImpl.create();
  beforeEach(() => {
    game = Game.create(BaseHeight.create(3), BaseWidth.create(3));
  });
  test('fill answer "1"', () => {
    game.fill(CellPosition.create(vPos(0), hPos(0)), Answer.create(1));
    expect(
      cellRepository
        .findByPosition(game.gameId, CellPosition.create(vPos(1), hPos(0)))
        .getAnswerCandidateStringArray()
    ).toEqual(['2', '3', '4', '5', '6', '7', '8', '9']);
  });
  test('fill answer "2"', () => {
    game.fill(CellPosition.create(vPos(0), hPos(0)), Answer.create(1));
    game.fill(CellPosition.create(vPos(0), hPos(1)), Answer.create(2));
    expect(
      cellRepository
        .findByPosition(game.gameId, CellPosition.create(vPos(1), hPos(0)))
        .getAnswerCandidateStringArray()
    ).toEqual(['3', '4', '5', '6', '7', '8', '9']);
  });
  test('fill answer "3"', () => {
    game.fill(CellPosition.create(vPos(0), hPos(0)), Answer.create(1));
    game.fill(CellPosition.create(vPos(0), hPos(1)), Answer.create(2));
    game.fill(CellPosition.create(vPos(0), hPos(2)), Answer.create(3));
    expect(
      cellRepository
        .findByPosition(game.gameId, CellPosition.create(vPos(1), hPos(0)))
        .getAnswerCandidateStringArray()
    ).toEqual(['4', '5', '6', '7', '8', '9']);
  });
  test('fill answer "4"', () => {
    game.fill(CellPosition.create(vPos(0), hPos(0)), Answer.create(1));
    game.fill(CellPosition.create(vPos(0), hPos(1)), Answer.create(2));
    game.fill(CellPosition.create(vPos(0), hPos(2)), Answer.create(3));
    game.fill(CellPosition.create(vPos(0), hPos(3)), Answer.create(4));
    expect(
      cellRepository
        .findByPosition(game.gameId, CellPosition.create(vPos(1), hPos(0)))
        .getAnswerCandidateStringArray()
    ).toEqual(['4', '5', '6', '7', '8', '9']);
  });
});
