import Game from '@/core/entity/game';
import CellRepository from '../../repository/cellRepository';
import { fillAllLonely } from './fillAllLonelyLogic';
import FillOwnAnswerIfLastOneAnswerCandidate from './fillOwnAnswerIfLastOneAnswerCandidateLogic';

/**
 * ゲーム全体を解析し答えを記入する
 * @returns 解析で答えが確定しなかったセルの数
 */
export function analyze({
  game,
  cellRepository,
}: {
  game: Game;
  cellRepository: CellRepository;
}) {
  doFill({ game, cellRepository });
  return getRemainingCount({ game, cellRepository });
}

function doFill({
  game,
  cellRepository,
}: {
  game: Game;
  cellRepository: CellRepository;
}) {
  let remainingCount: number;
  do {
    remainingCount = getRemainingCount({ game, cellRepository });
    fillAllLonely(game);
    FillOwnAnswerIfLastOneAnswerCandidate.create(game.gameId).execute();
  } while (remainingCount !== getRemainingCount({ game, cellRepository }));
  return remainingCount;
}

function getRemainingCount({
  game,
  cellRepository,
}: {
  game: Game;
  cellRepository: CellRepository;
}): number {
  let count = 0;
  cellRepository.findAll(game.gameId).forEach(cell => {
    if (cell.isAnswered) count++;
  });
  return cellRepository.findAll(game.gameId).length - count;
}
