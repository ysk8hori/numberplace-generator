import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import LoadLogic from '@/core/logic/loadLogic';
import CellRepository from '@/core/repository/cellRepository';
import Cell from '@/core/entity/cell';
import InfiniteAnalyzeLogic from '@/core/logic/analyze/infiniteAnalyze/infiniteAnalyzeLogic';
import OutputAnswerStringLogic from '@/core/logic/outputAnswerStringLogic';
import DeleteGameLogic from '@/core/logic/deleteGameLogic';
import { test, beforeAll, expect } from 'vitest';
import { container } from 'tsyringe';
import { GameType } from '@/core/types';

export default class TestDefiner {
  /**
   * issue、answers共に、カラムの区切り文字なし、行の区切りを'|'として渡すこと。
   * @param issue 問題
   * @param answers 答え
   */
  public static create(
    issue: string,
    answers: string,
    baseHeight = 3,
    baseWidth = 3,
    gameTypes: GameType[] = [],
  ): TestDefiner {
    return new TestDefiner(issue, answers)
      .setBaseHeight(BaseHeight.create(baseHeight))
      .setBaseWidth(BaseWidth.create(baseWidth))
      .setGameTypes(gameTypes)
      .initialize();
  }

  public constructor(
    private issue: string,
    private answers: string,
    private cellRepository: CellRepository = container.resolve(
      'CellRepository',
    ),
  ) {}

  public initialize(): TestDefiner {
    this.game = Game.create(this.baseHeight, this.baseWidth, this.gameTypes);
    this.answeredGame = Game.create(
      this.baseHeight,
      this.baseWidth,
      this.gameTypes,
    );
    return this;
  }

  private baseHeight: BaseHeight = BaseHeight.create(3);
  public setBaseHeight(baseHeight: BaseHeight): TestDefiner {
    this.baseHeight = baseHeight;
    return this;
  }
  private baseWidth: BaseWidth = BaseWidth.create(3);
  public setBaseWidth(baseWidth: BaseWidth): TestDefiner {
    this.baseWidth = baseWidth;
    return this;
  }
  private gameTypes: GameType[] = [];
  public setGameTypes(gameTypes: GameType[]): TestDefiner {
    this.gameTypes = gameTypes;
    return this;
  }
  private game!: Game;
  private answeredGame!: Game;

  public defineBeforeAll() {
    beforeAll(() => {
      const colSplitter =
        10 <= this.baseHeight.value * this.baseWidth.value ? ',' : '';
      LoadLogic.create(this.game.gameId).execute(this.issue, {
        rowSplitter: '|',
        colSplitter,
      });
      InfiniteAnalyzeLogic.createAndExecute(this.game.gameId);
      console.log(
        OutputAnswerStringLogic.create(this.game.gameId).getAnswerString(),
      );
      LoadLogic.create(this.answeredGame.gameId).execute(this.answers, {
        rowSplitter: '|',
        colSplitter,
      });
    });
  }
  public defineTests() {
    // test('残件が0であること', () => {
    //   expect(this.remainingCount).toBe(0);
    // });
    this.cellRepository
      ?.findAll(this.answeredGame.gameId)
      .forEach(answeredCell => this.defineOneTest(answeredCell));
  }

  private defineOneTest(answeredCell: Cell) {
    test(`${answeredCell.position.toString()}が${
      answeredCell.getAnswer()?.value
    }であること`, () => {
      expect(
        this.cellRepository
          ?.findByPosition(this.game.gameId, answeredCell.position)
          .getAnswer()?.value,
      ).toEqual(answeredCell.getAnswer()?.value);
    });
  }
  public destructor() {
    const deleteGameLogic = DeleteGameLogic.create();
    deleteGameLogic.execute(this.game.gameId);
    deleteGameLogic.execute(this.answeredGame.gameId);
  }
}
