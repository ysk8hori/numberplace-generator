import GameID from '@/core/valueobject/gameId';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import InfiniteAnalyzeLogic from '../analyze/infiniteAnalyze/infiniteAnalyzeLogic';
import Utils from '@/utils/utils';
import AnswerLogic from '../analyze/answerLogic';
import Game from '@/core/entity/game';
import Cell from '@/core/entity/cell';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import DeleteGameLogic from '../deleteGameLogic';

type Params = {
  baseHeight: BaseHeight;
  baseWidth: BaseWidth;
  cellRepository: CellRepository;
  groupRepository: GroupRepository;
  gameRepository: GameRepository;
};

export function createGame({
  baseHeight,
  baseWidth,
  cellRepository,
  groupRepository,
  gameRepository,
}: Params): GameID {
  const game = Game.create(baseHeight, baseWidth);
  const answeredGame = game.clone();
  InfiniteAnalyzeLogic.createAndExecute(answeredGame.gameId, true);

  // clonedGameからgameIdのゲームに20数個のセル答えを転写する。
  const shuffledAnsweredCells = Utils.shuffle(
    cellRepository.findAll(answeredGame.gameId)
  );
  for (let i = 0; i < getBaseAnsweredCellCount({ cellRepository, game }); i++) {
    const cell = shuffledAnsweredCells.pop();
    if (!cell) break;
    AnswerLogic.createAndExecute(game.gameId, cell.position, cell.getAnswer()!);
  }
  // 解析を行いdifficaltyを見る。1以上だったら難しいのでさらにもう1つ答えを転写して・・・以降ループ。
  let clonedGame: Game;
  const deleteGameLogic = DeleteGameLogic.create();
  // console.log('微調整開始');
  do {
    clonedGame = tune({ shuffledAnsweredCells, game });
    deleteGameLogic.execute(clonedGame.gameId);
  } while (clonedGame.difficalty?.value !== 0);
  // console.log('微調整完了');

  deleteGameLogic.execute(answeredGame.gameId);

  return game.gameId;
}

/** 微調整する */
function tune({
  shuffledAnsweredCells,
  game,
}: {
  shuffledAnsweredCells: Cell[];
  game: Game;
}): Game {
  const answeredCell = shuffledAnsweredCells.pop();
  AnswerLogic.createAndExecute(
    game.gameId,
    answeredCell!.position,
    answeredCell!.getAnswer()!
  );
  const clonedGame = game.clone();
  InfiniteAnalyzeLogic.createAndExecute(clonedGame.gameId, true);
  return clonedGame;
}

/** 答えを入力しておくセルの数を取得する。 */
function getBaseAnsweredCellCount({
  game,
  cellRepository,
}: {
  game: Game;
  cellRepository: CellRepository;
}): number {
  return (cellRepository.findAll(game.gameId).length / 10) * 3;
}
