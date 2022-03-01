import GameID from '../../valueobject/gameId';
import CellRepository from '../../repository/cellRepository';
import FillAllLonelyLogic from './fillAllLonelyLogic';
import FillOwnAnswerIfLastOneAnswerCandidate from './fillOwnAnswerIfLastOneAnswerCandidateLogic';

/**
 * ゲーム全体を解析し答えを記入する
 * @returns 解析で答えが確定しなかったセルの数
 */
export function analyze({
  gameId,
  cellRepository,
}: {
  gameId: GameID;
  cellRepository: CellRepository;
}) {
  doFill({ gameId, cellRepository });
  return getRemainingCount({ gameId, cellRepository });
}

function doFill({
  gameId,
  cellRepository,
}: {
  gameId: GameID;
  cellRepository: CellRepository;
}) {
  let remainingCount: number;
  do {
    remainingCount = getRemainingCount({ gameId, cellRepository });
    FillAllLonelyLogic.create(gameId).execute();
    FillOwnAnswerIfLastOneAnswerCandidate.create(gameId).execute();
  } while (remainingCount !== getRemainingCount({ gameId, cellRepository }));
  return remainingCount;
}

function getRemainingCount({
  gameId,
  cellRepository,
}: {
  gameId: GameID;
  cellRepository: CellRepository;
}): number {
  let count = 0;
  cellRepository.findAll(gameId).forEach(cell => {
    if (cell.isAnswered) count++;
  });
  return cellRepository.findAll(gameId).length - count;
}
