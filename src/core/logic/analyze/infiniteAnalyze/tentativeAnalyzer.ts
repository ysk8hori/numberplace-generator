import GameID from '@/core/valueobject/gameId';
import TentativeDecision from './tentativeDecision';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import InfiniteAnalyzeLogic from './infiniteAnalyzeLogic';
import Game from '@/core/entity/game';
import AnalyzeLogic from '../analyzeLogic';
import Cell from '@/core/entity/cell';
import Utils from '@/utils/utils';
import DeleteGameLogic from '../../deleteGameLogic';
import { container } from 'tsyringe';

/**
 * Gameの解析がAnalizeLogicで完了できない場合に、仮でいずれかのセルに値を入力して解析を進めるためのクラス。
 */
export default class TentativeAnalyzer {
  public static create(
    parrentGameId: GameID,
    create = false,
    tentativeDecision?: TentativeDecision,
  ): TentativeAnalyzer {
    return new TentativeAnalyzer(parrentGameId, create, tentativeDecision);
  }
  constructor(
    private parrentGameId: GameID,
    private isCreate: boolean,
    private tentativeDecision?: TentativeDecision,
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    TentativeAnalyzer.count++;
    if (2000 < TentativeAnalyzer.count) {
      BusinessError.throw(
        InfiniteAnalyzeLogic.name,
        'constructor',
        '処理が終了しませんでした。',
      );
    }
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        InfiniteAnalyzeLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.cellRepository = cellRepository;
    this.gameRepository = gameRepository;
    const parrentGame = gameRepository.find(this.parrentGameId);
    this.myGame = parrentGame.clone();
  }
  private cellRepository: CellRepository;
  private gameRepository: GameRepository;
  private myGame: Game;
  /** 解析に成功した際のGameID */
  private _successGameId?: GameID;
  static count = 1;
  /**
   * 解析に成功した際のGameID。解析できなかった場合はundefined。
   */
  public get successGameId(): GameID | undefined {
    return this._successGameId;
  }
  public execute() {
    if (this.tentativeDecision) {
      // 仮入力値とそれを入力するセルが指定されている場合はそれを反映する。
      this.fillFromTentativeDecisioin(this.tentativeDecision);
    }
    // 解析をして残セル数を取得する。残セル数が0なら解析成功。
    if (AnalyzeLogic.create(this.myGame.gameId).execute() === 0) {
      this._successGameId = this.myGame.gameId;
      return;
    }
    for (const tentativeDecision of this.generateTentativeDecision()) {
      this.myGame.incrementDifficalty(); // 仮で値を決める場合は難易度が上がる。難易度はゲーム作成の際に参照する。
      this.executeOneTentativeAnalize(tentativeDecision);
      if (this._successGameId) {
        DeleteGameLogic.create().execute(this.myGame.gameId);
        return;
      }
    }
    // メモリ解放
    DeleteGameLogic.create().execute(this.myGame.gameId);
  }

  private executeOneTentativeAnalize(tentativeDecision: TentativeDecision) {
    const tentativeAnalyzer = TentativeAnalyzer.create(
      this.myGame.gameId,
      this.isCreate,
      tentativeDecision,
    );
    tentativeAnalyzer.execute();
    if (tentativeAnalyzer.successGameId) {
      this._successGameId = tentativeAnalyzer.successGameId;
      return;
    }
  }

  private fillFromTentativeDecisioin(tentativeDecision: TentativeDecision) {
    // console.log(
    //   `${tentativeDecision.cellPosition.toString()}に仮で${
    //     tentativeDecision.answer.value
    //   }を入力して${TentativeAnalyzer.count++}回目の解析を行います。`
    // );
    this.myGame.fill(tentativeDecision.cellPosition, tentativeDecision.answer);
  }

  private *generateTentativeDecision(): Generator<TentativeDecision> {
    for (const cell of this.getShuffledMinimumAnswerCountCells()) {
      yield* this.generateTentativeDecisionForOneCell(cell);
    }
  }

  private *generateTentativeDecisionForOneCell(cell: Cell) {
    for (const answerCandidate of this.isCreate
      ? Utils.shuffle(cell.getAnswerCandidateIterator())
      : cell.getAnswerCandidateIterator()) {
      yield new TentativeDecision(cell.position, answerCandidate.toAnswer());
    }
  }
  private getShuffledMinimumAnswerCountCells(): Cell[] {
    return this.isCreate
      ? Utils.shuffle(
          this.cellRepository.getMinimumAnswerCountCells(this.myGame.gameId),
        )
      : this.cellRepository.getMinimumAnswerCountCells(this.myGame.gameId);
  }
}
