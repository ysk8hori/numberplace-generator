import GameID from '@/core/valueobject/gameId';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import InfiniteAnalyzeLogic from '../analyze/infiniteAnalyze/infiniteAnalyzeLogic';
import Utils from '@/utils/utils';
import AnswerLogic from '../analyze/answerLogic';
import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import DeleteGameLogic from '../deleteGameLogic';
import { container } from 'tsyringe';
import AnalyzeLogic from '../analyze/analyzeLogic';
import Answer from '@/core/valueobject/answer';
import { pos } from '@/core/valueobject/cellPosition';
import { GameType } from '@/core/types';
import Cell from '@/core/entity/cell';

export default class CreateGameLogic {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
    option?: { gameTypes?: GameType[]; kiwami?: boolean },
  ): CreateGameLogic {
    return new CreateGameLogic(baseHeight, baseWidth, option);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    private option?: { gameTypes?: GameType[]; kiwami?: boolean },
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
    this.gameRepository = gameRepository;
    this.game = Game.create(baseHeight, baseWidth, option?.gameTypes);
  }
  private cellRepository: CellRepository;
  private gameRepository: GameRepository;
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
        Answer.create(answer + 1),
      ),
    );

    InfiniteAnalyzeLogic.createAndExecute(answeredGame.gameId, true);

    // 極みの際にここで難易度のチェックをしないのは、makeHard を再実行しても
    // 難易度が変わらないケースがあることを懸念しているため。
    // createGameLogic の外で難易度チェック＆再実行を行うことで
    // 全く異なる解を生成する。
    this.makeHard(answeredGame);
    this.deleteGameLogic.execute(answeredGame.gameId);

    return this.game.gameId;
  }

  /** 余分な記入セルを除去していき、ゲームが成り立つかを逐一チェックする */
  private makeHard(answeredGame: Game) {
    const filledCells = this.cellRepository
      .findAll(answeredGame.gameId)
      .filter(cell => cell.isAnswered);
    const resultFilledCells = Utils.shuffle(
      this.cellRepository
        .findAll(answeredGame.gameId)
        .filter(cell => cell.isAnswered),
    );
    for (let i = 0; i < filledCells.length; i++) {
      this.popAndCheck(resultFilledCells, tempGame => {
        const emptyCellCount = AnalyzeLogic.create(tempGame.gameId).execute();
        return emptyCellCount === 0;
      });
    }
    if (this.option?.kiwami) {
      // レベル「極」の問題にする
      const tempResultFilledCells = Array.from(resultFilledCells);
      for (let i = 0; i < tempResultFilledCells.length; i++) {
        this.popAndCheck(resultFilledCells, tempGame => {
          const fliped = tempGame.fliped();
          try {
            InfiniteAnalyzeLogic.createAndExecute(fliped.gameId);
            const maybeSameAsAnswered = fliped.fliped();
            const newFilledCells = this.cellRepository.findAll(
              maybeSameAsAnswered.gameId,
            );
            const same = filledCells.every(cell =>
              newFilledCells
                .find(newCell => newCell.isSamePosition(cell.position))
                ?.answer?.equals(cell.answer),
            );
            if (same) {
              // targetCell はなくても良いってこと
              this.gameRepository.find(this.game.gameId).incrementDifficalty();
              return true;
            } else {
              return false;
            }
          } catch (e) {
            return false;
          } finally {
            this.deleteGameLogic.execute(fliped.gameId);
          }
        });
      }
    }
    resultFilledCells.forEach(cell =>
      AnswerLogic.createAndExecute(
        this.game.gameId,
        cell.position,
        cell.answer!,
      ),
    );
  }

  /**
   * 渡された記入済みセルのリストから一つ pop してゲームが成り立つかどうかをチェックする。
   *
   * - ゲームが成り立つ場合、pop したままの記入済みセルのリストを返却する
   * - ゲームが成り立たない場合、pop した記入済みセルをリストの先頭に追加し、リストを返却する
   */
  private popAndCheck(
    resultFilledCells: Cell[],
    isNeedjudgeFunction: (tempGame: Game) => boolean,
  ) {
    const targetCell = resultFilledCells.pop();
    const tempGame = Game.create(
      this.baseHeight,
      this.baseWidth,
      this.option?.gameTypes,
    );
    // pop してるので元のゲームより答えが一つ少ないゲームが出来上がる
    resultFilledCells.forEach(cell =>
      AnswerLogic.createAndExecute(
        tempGame.gameId,
        cell.position,
        cell.answer!,
      ),
    );
    if (isNeedjudgeFunction(tempGame)) {
      // targetCell はなくても良いってこと
    } else {
      // targetCell は必要なので先頭に追加しておく（上で pop してここで先頭追加）
      resultFilledCells.unshift(targetCell!);
    }
    this.deleteGameLogic.execute(tempGame.gameId);
  }
}
