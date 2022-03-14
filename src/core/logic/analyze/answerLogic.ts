import Answer from '@/core/valueobject/answer';
import CellPosition from '@/core/valueobject/cellPosition';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import Cell from '@/core/entity/cell';
import GameID from '@/core/valueobject/gameId';
import { container } from 'tsyringe';

/** 1つのCellに答えを記入する際のロジック */
export default class AnswerLogic {
  /**
   * AnswerLogicのインスタンスを生成し、答え記入処理を実行する。
   * @param gameId ゲームID
   * @param position 答えを記入するCellのポジション
   * @param answer 答え
   */
  public static createAndExecute(
    gameId: GameID,
    position: CellPosition,
    answer: Answer,
  ) {
    new AnswerLogic(gameId, position, answer).execute();
  }
  /**
   * コンストラクタ
   * @param gameId ゲームID
   * @param position 答えを記入するCellのポジション
   * @param answer 答え
   * @param cellRepository Cellリポジトリ
   * @param groupRepository グループリポジトリ
   */
  constructor(
    private gameId: GameID,
    private position: CellPosition,
    private answer: Answer,
    private cellRepository: CellRepository = container.resolve(
      'CellRepository',
    ),
    private groupRepository: GroupRepository = container.resolve(
      'GroupRepository',
    ),
  ) {
    this.cell = this.cellRepository!.findByPosition(this.gameId, this.position);
  }
  private cell: Cell;

  /**
   * 解答を記入する。
   * 記入後、各グループのAnsweredCallbackを実行する。
   */
  public execute(): void {
    this.cell.setAnswer(this.answer);
    this.cell.clearAnswerCandidateList();
    this.callGroupsOnAnswered(this.answer);
    // this.callFillLonely();
  }

  /**
   * 対象のCellが所属するグループのonAnsweredメソッドをコールする。
   * @param answer 答え
   */
  private callGroupsOnAnswered(answer: Answer) {
    if (answer)
      this.cell.groupIds.forEach(groupId => {
        this.groupRepository?.find(this.gameId, groupId).onAnswered(answer);
      });
  }

  /**
   * 対象のCellが所属するグループのFillLonelyロジックを実行する
   */
  private callFillLonely() {
    this.cell.groupIds.forEach(groupId =>
      this.groupRepository?.find(this.gameId, groupId).fillLonely(),
    );
  }
}
