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
import AnalyzeLogic from '../analyze/analyzeLogic';
import Answer from '@/core/valueobject/answer';
import CellPosition, { pos } from '@/core/valueobject/cellPosition';
import { GameType } from '@/core/types';

export default class CreateGameLogic {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
    option?: { gameTypes?: GameType[] },
  ): CreateGameLogic {
    return new CreateGameLogic(baseHeight, baseWidth, option);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    option?: { gameTypes?: GameType[] },
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
    this.game = Game.create(baseHeight, baseWidth, option?.gameTypes);
  }
  private cellRepository: CellRepository;
  private game: Game;
  private deleteGameLogic = DeleteGameLogic.create();

  public execute(): GameID {
    const answeredGame = this.game.clone();

    // 横一列をランダムに記入する
    const answers = Utils.createArray(
      this.baseHeight.value * this.baseWidth.value,
    );
    const shuffledAnswers = Utils.shuffle(answers);
    shuffledAnswers.forEach((answer, i) =>
      AnswerLogic.createAndExecute(
        answeredGame.gameId,
        pos(0, i),
        Answer.create(answer),
      ),
    );

    InfiniteAnalyzeLogic.createAndExecute(answeredGame.gameId, true);

    // 余分な記入セルを除去していき、ゲームが成り立つかを逐一チェックする
    const filledCells = this.cellRepository
      .findAll(answeredGame.gameId)
      .filter(cell => cell.isAnswered);
    const resultFilledCells = Utils.shuffle(
      this.cellRepository
        .findAll(answeredGame.gameId)
        .filter(cell => cell.isAnswered),
    );
    for (let i = 0; i < filledCells.length; i++) {
      const targetCell = resultFilledCells.pop();
      const tempGame = Game.create(this.baseHeight, this.baseWidth);
      // pop してるので元のゲームより答えが一つ少ないゲームが出来上がる
      resultFilledCells.forEach(cell =>
        AnswerLogic.createAndExecute(
          tempGame.gameId,
          cell.position,
          cell.answer!,
        ),
      );
      const asdf = AnalyzeLogic.create(tempGame.gameId).execute();
      if (asdf === 0) {
        // targetCell はなくても良いってこと
      } else {
        // targetCell は必要なので先頭に追加しておく（上で pop してここで先頭追加）
        resultFilledCells.unshift(targetCell!);
      }
      this.deleteGameLogic.execute(tempGame.gameId);
    }
    resultFilledCells.forEach(cell =>
      AnswerLogic.createAndExecute(
        this.game.gameId,
        cell.position,
        cell.answer!,
      ),
    );
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
