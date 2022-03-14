import GameID from '@/core/valueobject/gameId';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import InfiniteAnalyzeLogic from '../analyze/infiniteAnalyze/infiniteAnalyzeLogic';
import Utils from '@/utils/utils';
import AnswerLogic from '../analyze/answerLogic';
import Game from '@/core/entity/game';
import Cell from '@/core/entity/cell';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import DeleteGameLogic from '../deleteGameLogic';
import { container } from 'tsyringe';

export default class CreateGameLogic {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
  ): CreateGameLogic {
    return new CreateGameLogic(baseHeight, baseWidth);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        CreateGameLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.cellRepository = cellRepository;
    this.game = Game.create(baseHeight, baseWidth);
  }
  private cellRepository: CellRepository;
  private game: Game;
  private deleteGameLogic = DeleteGameLogic.create();

  public execute(): GameID {
    const answeredGame = this.game.clone();
    InfiniteAnalyzeLogic.createAndExecute(answeredGame.gameId, true);

    // clonedGameからthis.gameIdのゲームに20数個のセル答えを転写する。
    const shuffledAnsweredCells = Utils.shuffle(
      this.cellRepository.findAll(answeredGame.gameId),
    );
    for (let i = 0; i < this.getBaseAnsweredCellCount(); i++) {
      const cell = shuffledAnsweredCells.pop();
      if (!cell) break;
      AnswerLogic.createAndExecute(
        this.game.gameId,
        cell.position,
        cell.getAnswer()!,
      );
    }
    // 解析を行いdifficaltyを見る。1以上だったら難しいのでさらにもう1つ答えを転写して・・・以降ループ。
    let clonedGame: Game;
    // console.log('微調整開始');
    do {
      clonedGame = this.微調整する(shuffledAnsweredCells);
      this.deleteGameLogic.execute(clonedGame.gameId);
    } while (clonedGame.difficalty?.value !== 0);
    // console.log('微調整完了');

    this.deleteGameLogic.execute(answeredGame.gameId);

    return this.game.gameId;
  }

  private 微調整する(shuffledAnsweredCells: Cell[]): Game {
    const answeredCell = shuffledAnsweredCells.pop();
    AnswerLogic.createAndExecute(
      this.game.gameId,
      answeredCell!.position,
      answeredCell!.getAnswer()!,
    );
    const clonedGame = this.game.clone();
    InfiniteAnalyzeLogic.createAndExecute(clonedGame.gameId, true);
    return clonedGame;
  }

  /** 答えを入力しておくセルの数を取得する。 */
  private getBaseAnsweredCellCount(): number {
    return (this.cellRepository.findAll(this.game.gameId).length / 10) * 3;
  }
}
