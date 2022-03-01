import GameID from '@/core/valueobject/gameId';
import TentativeDecision from './tentativeDecision';
import CellRepository from '@/core/repository/cellRepository';
import BusinessError from '@/core/businessError';
import Game from '@/core/entity/game';
import { analyze } from '../analyzeLogic';
import Cell from '@/core/entity/cell';
import Utils from '@/utils/utils';
import DeleteGameLogic from '../../deleteGameLogic';

export default class TentativeAnalyzer {
  static count = 1;
}

/**
 * Gameの解析がAnalizeLogicで完了できない場合に、仮でいずれかのセルに値を入力して解析を進めるためのクラス。
 */
export function tentativeAnalyze({
  isCreate,
  cellRepository,
  parrentGame,
  tentativeDecision,
}: {
  isCreate: boolean;
  cellRepository: CellRepository;
  parrentGame: Game;
  tentativeDecision?: TentativeDecision;
}): GameID | undefined {
  TentativeAnalyzer.count++;
  if (1000 < TentativeAnalyzer.count) {
    BusinessError.throw(
      'tentativeAnalyze',
      'tentativeAnalyze',
      '処理が終了しませんでした。'
    );
  }
  const game = parrentGame.clone();

  if (tentativeDecision) {
    // 仮入力値とそれを入力するセルが指定されている場合はそれを反映する。
    fillFromTentativeDecisioin({
      tentativeDecision: tentativeDecision,
      myGame: game,
    });
  }
  // 解析をして残セル数を取得する。残セル数が0なら解析成功。
  if (analyze({ gameId: game.gameId, cellRepository: cellRepository }) === 0) {
    return game.gameId;
  }
  for (const tentativeDecision of generateTentativeDecision({
    isCreate: isCreate,
    cellRepository: cellRepository,
    myGame: game,
  })) {
    game.incrementDifficalty(); // 仮で値を決める場合は難易度が上がる。難易度はゲーム作成の際に参照する。
    const successGameId = tentativeAnalyze({
      tentativeDecision,
      parrentGame: game,
      isCreate: isCreate,
      cellRepository,
    });
    if (successGameId) {
      DeleteGameLogic.create().execute(game.gameId);
      return successGameId;
    }
  }
  // メモリ解放
  DeleteGameLogic.create().execute(game.gameId);
}

function fillFromTentativeDecisioin({
  tentativeDecision,
  myGame,
}: {
  tentativeDecision: TentativeDecision;
  myGame: Game;
}) {
  // console.log(
  //   `${tentativeDecision.cellPosition.toString()}に仮で${
  //     tentativeDecision.answer.value
  //   }を入力して${TentativeAnalyzer.count++}回目の解析を行います。`
  // );
  myGame.fill(tentativeDecision.cellPosition, tentativeDecision.answer);
}

function* generateTentativeDecision({
  isCreate,
  cellRepository,
  myGame,
}: {
  isCreate: boolean;
  cellRepository: CellRepository;
  myGame: Game;
}): Generator<TentativeDecision> {
  for (const cell of getShuffledMinimumAnswerCountCells({
    isCreate,
    cellRepository,
    myGame,
  })) {
    yield* generateTentativeDecisionForOneCell({ cell, isCreate });
  }
}

function* generateTentativeDecisionForOneCell({
  cell,
  isCreate,
}: {
  cell: Cell;
  isCreate: boolean;
}) {
  for (const answerCandidate of isCreate
    ? Utils.shuffle(cell.getAnswerCandidateIterator())
    : cell.getAnswerCandidateIterator()) {
    yield new TentativeDecision(cell.position, answerCandidate.toAnswer());
  }
}

function getShuffledMinimumAnswerCountCells({
  isCreate,
  cellRepository,
  myGame,
}: {
  isCreate: boolean;
  cellRepository: CellRepository;
  myGame: Game;
}): Cell[] {
  return isCreate
    ? Utils.shuffle(cellRepository.getMinimumAnswerCountCells(myGame.gameId))
    : cellRepository.getMinimumAnswerCountCells(myGame.gameId);
}
