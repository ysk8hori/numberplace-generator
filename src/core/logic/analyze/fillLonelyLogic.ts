import Cell from '@/core/entity/cell';
import AnswerCandidate from '@/core/valueobject/answerCandidate';
import Group from '@/core/entity/group';
import GroupID from '@/core/valueobject/groupId';
import { autoInjectable, inject } from 'tsyringe';
import GroupRepository from '@/core/repository/groupRepository';
import GameID from '@/core/valueobject/gameId';
import { fillOneAnswer } from '@/core/logic/analyze/answerLogic';
import CellRepository from '@/core/repository/cellRepository';
import GameRepository from '@/core/repository/gameRepository';

/**
 * グループ内で、とある候補がそのグループ内の1つのCellにしか存在しない場合に、
 * そのCellの答えをその候補で決定するロジック。
 * 全候補に対して行う。
 */
@autoInjectable()
export default class FillLonelyLogic {
  /**
   * FillLonelyLogicのインスタンスを生成する。
   * @param groupId FillLonelyLogicを実行する対象のグループID
   */
  public static create(gameId: GameID, groupId: GroupID): FillLonelyLogic {
    return new FillLonelyLogic(gameId, groupId);
  }

  /**
   * コンストラクタ
   * @param answerCandidateCollection グループが持つ答え候補コレクション
   * @param cells グループが持つCell
   */
  public constructor(
    private gameId: GameID,
    private groupId: GroupID,
    @inject('GameRepository')
    private gameRepository?: GameRepository,
    @inject('GroupRepository')
    private groupRepository?: GroupRepository,
    @inject('CellRepository')
    private cellRepository?: CellRepository,
  ) {
    this.group = this.groupRepository!.find(this.gameId, this.groupId);
  }
  private group: Group;

  /**
   * グループ内で、とある候補が1つのCellにしか存在しない場合に、そのCellの答えをその候補で決定するロジック。
   * 全候補に対して行う。
   */
  public do() {
    this.group.answerCandidateCollection.forEach(answerCandidate => {
      const cellList = this.getFillableCells(answerCandidate);
      if (cellList.length === 1) {
        fillOneAnswer({
          game: this.gameRepository!.find(this.gameId)!,
          answer: answerCandidate.toAnswer(),
          position: cellList[0].position,
          cellRepository: this.cellRepository!,
          groupRepository: this.groupRepository!,
        });
      }
    });
  }

  /**
   * 持っているCellのうち、以下の条件に当てはまるCellを取得する
   * - 未回答Cellであること
   * - 引数で指定された候補を持っていること
   * @param answerCandidate
   */
  private getFillableCells(answerCandidate: AnswerCandidate): Cell[] {
    return this.group.cells.filter(
      cell => !cell.isAnswered && cell.hasAnswerCandidate(answerCandidate),
    );
  }
}
