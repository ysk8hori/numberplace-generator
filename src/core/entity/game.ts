import CellPosition from '../valueobject/cellPosition';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import Answer from '@/core/valueobject/answer';
import Height from '@/core/valueobject/height';
import Width from '@/core/valueobject/width';
import CellFactory from '@/core/factory/cellFactory';
import CellCollection from '@/core/cellCollection';
import GroupFactory from '@/core/factory/groupFactory';
import GameID from '@/core/valueobject/gameId';
import AnswerLogic from '@/core/logic/analyze/answerLogic';
import GameRepository from '@/core/repository/gameRepository';
import { inject, autoInjectable } from 'tsyringe';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import FillOwnAnswerIfLastOneAnswerCandidate from '@/core/logic/analyze/fillOwnAnswerIfLastOneAnswerCandidateLogic';
import FillAllLonelyLogic from '@/core/logic/analyze/fillAllLonelyLogic';
import AnalyzeLogic from '../logic/analyze/analyzeLogic';
import Difficalty from '../valueobject/difficalty';
import GameSize from './gameSize';

@autoInjectable()
export default class Game {
  public static create(baseHeight: BaseHeight, baseWidth: BaseWidth): Game {
    return new Game(baseHeight, baseWidth);
  }
  public constructor(
    private _baseHeight: BaseHeight,
    private _baseWidth: BaseWidth,
    @inject('GameRepository')
    gameRepository?: GameRepository,
  ) {
    this._height = Height.create(this.baseHeight, this.baseWidth);
    this._width = Width.create(this.baseHeight, this.baseWidth);
    this._gameId = GameID.create();
    this._answerCandidateCollection = AnswerCandidateCollection.create(
      this.baseHeight,
      this.baseWidth,
    );
    this.cells = CellFactory.create(
      this.gameId,
      this.baseHeight,
      this.baseWidth,
      this.answerCandidateCollection,
    ).createCells();
    GroupFactory.create(
      this.gameId,
      this.baseHeight,
      this.baseWidth,
    ).createGroups();
    gameRepository?.regist(this);
  }

  public get baseWidth(): BaseWidth {
    return this._baseWidth;
  }
  public get baseHeight(): BaseHeight {
    return this._baseHeight;
  }

  /** ゲームID */
  private _gameId: GameID;
  /** ゲームID */
  public get gameId(): GameID {
    return this._gameId;
  }
  /** ゲームボードにある全Cell */
  private cells: CellCollection;
  /** ゲームボードの横幅 */
  private _width: Width;
  /** ゲームボードの縦幅 */
  private _height: Height;
  /** 解答候補 */
  private _answerCandidateCollection: AnswerCandidateCollection;
  /** 解答候補（クローン） */
  public get answerCandidateCollection(): AnswerCandidateCollection {
    return this._answerCandidateCollection.clone();
  }
  public difficalty: Difficalty = Difficalty.create();

  /**
   * 解答を記入する。
   * @param position 解答を記入するCellのポジション
   * @param answer 解答
   */
  public fill(position: CellPosition, answer: Answer) {
    AnswerLogic.createAndExecute(this.gameId, position, answer);
    FillOwnAnswerIfLastOneAnswerCandidate.create(this.gameId).execute();
    FillAllLonelyLogic.create(this.gameId).execute();
  }
  public getAnswer(position: CellPosition): Answer | undefined {
    return this.cells.get(position).answer;
  }
  public getAnswerCandidate(position: CellPosition): string[] {
    return this.cells.get(position).getAnswerCandidateStringArray();
  }

  public clone(): Game {
    const clonedGame = Game.create(this.baseHeight, this.baseWidth);
    // 難易度をコピー
    clonedGame.setDifficalty(this.difficalty);
    this.cells.findAll().forEach(cell => {
      if (cell.answer)
        AnswerLogic.createAndExecute(
          clonedGame.gameId,
          cell.position,
          cell.answer,
        );
    });
    AnalyzeLogic.create(clonedGame.gameId).execute();
    return clonedGame;
  }

  public incrementDifficalty(): Game {
    this.difficalty.increment();
    return this;
  }
  public setDifficalty(difficalty: Difficalty) {
    this.difficalty = Difficalty.create(difficalty.value);
  }

  public get gameSize(): GameSize {
    return GameSize.create(
      this.baseHeight.value,
      this.baseWidth.value,
    ) as GameSize;
  }
}
