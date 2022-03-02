import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import { infiniteAnalyze } from '../analyze/infiniteAnalyze/infiniteAnalyze';
import Utils from '@/utils/utils';
import { fillOneAnswer } from '../analyze/answerLogic';
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
}: Params): Game {
  const game = Game.create(baseHeight, baseWidth);
  const answeredGame = game.clone();
  infiniteAnalyze({
    game: answeredGame,
    isCreate: true,
    cellRepository,
    groupRepository,
    gameRepository,
  });

  // clonedGameからgameIdのゲームに20数個のセル答えを転写する。
  const shuffledAnsweredCells = Utils.shuffle(
    cellRepository.findAll(answeredGame.gameId),
  );
  for (let i = 0; i < getBaseAnsweredCellCount({ cellRepository, game }); i++) {
    const cell = shuffledAnsweredCells.pop();
    if (!cell) break;
    fillOneAnswer({
      game,
      position: cell.position,
      answer: cell.getAnswer()!,
      cellRepository,
      groupRepository,
    });
  }
  // 解析を行いdifficaltyを見る。1以上だったら難しいのでさらにもう1つ答えを転写して・・・以降ループ。
  let clonedGame: Game;
  const deleteGameLogic = DeleteGameLogic.create();
  // console.log('微調整開始');
  do {
    clonedGame = tune({
      shuffledAnsweredCells,
      game,
      cellRepository,
      groupRepository,
      gameRepository,
    });
    deleteGameLogic.execute(clonedGame.gameId);
  } while (clonedGame.difficalty?.value !== 0);
  // console.log('微調整完了');

  deleteGameLogic.execute(answeredGame.gameId);

  return game;
}

/** 微調整する */
function tune({
  shuffledAnsweredCells,
  game,
  cellRepository,
  groupRepository,
  gameRepository,
}: {
  shuffledAnsweredCells: Cell[];
  game: Game;
  cellRepository: CellRepository;
  groupRepository: GroupRepository;
  gameRepository: GameRepository;
}): Game {
  const answeredCell = shuffledAnsweredCells.pop();

  fillOneAnswer({
    game,
    position: answeredCell!.position,
    answer: answeredCell!.getAnswer()!,
    cellRepository,
    groupRepository,
  });
  const clonedGame = game.clone();

  infiniteAnalyze({
    game: clonedGame,
    isCreate: true,
    cellRepository,
    groupRepository,
    gameRepository,
  });
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
