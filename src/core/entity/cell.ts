import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import Answer from '@/core/valueobject/answer';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';
import CellPosition from '@/core/valueobject/cellPosition';
import IAnswer from '@/core/valueobject/iAnswer';
import AnswerCandidate from '@/core/valueobject/answerCandidate';
import GroupID from '@/core/valueobject/groupId';
import AnswerLogic from '@/core/logic/analyze/answerLogic';
import GameID from '@/core/valueobject/gameId';
import { GroupType } from '@/core/entity/group';
import BusinessError from '@/core/businessError';

/**
 * Cell。
 * PositionをIDとして持つEntity。
 */
export default class Cell {
  public static create(
    gameId: GameID,
    position: CellPosition,
    answerCandidateCollection: AnswerCandidateCollection,
  ): Cell {
    return new Cell(gameId, position, answerCandidateCollection);
  }

  /**
   * コンストラクタ。
   * @deprecated
   */
  public constructor(
    private gameId: GameID,
    public readonly position: CellPosition,
    private answerCandidateList: AnswerCandidateCollection,
  ) {}
  private _answer?: Answer;
  private myGroupIds: GroupID[] = [];

  /** 本Cellが所属するグループのIDの配列 */
  public get groupIds(): GroupID[] {
    return this.myGroupIds;
  }

  public getGroupIdByType(groupType: GroupType): GroupID {
    return this.groupIds.find(groupId => groupId.type === groupType)!;
  }

  /**
   * 指定した値を答えの候補から除外する。
   * @param removeValue 除外対象の答えの候補
   */
  public removeCandidate(removeValue: IAnswer): void {
    this.answerCandidateList.removeCandidate(removeValue);
    // if (this.answerCandidateList.length === 0 && !this.isAnswered) {
    //   console.log(
    //     `未回答のCellの答えの候補が0件になりました。position:${this.position.toString()} `
    //   );
    // }
  }

  /**
   * 本Cellの答えの候補が1つのみであった場合、その候補を答えとして確定する。
   */
  public fillOwnAnswerIfLastOneAnswerCandidate() {
    if (!this.answerCandidateList.isLastOne()) return;
    AnswerLogic.createAndExecute(
      this.gameId,
      this.position,
      this.answerCandidateList.getLastOne().toAnswer(),
    );
  }

  /**
   * 所属するグループの情報を追加する
   * @param groupID 所属するグループ
   */
  public joinGroup(groupID: GroupID): void {
    this.myGroupIds.push(groupID);
  }

  /**
   * 解答を記入する。
   * 記入後、各グループのAnsweredCallbackを実行する。
   */
  public setAnswer(answer: Answer): void {
    // console.log(
    //   `[Cell#setAnswer] Pos(${this.position.verticalPosition.value}, ${this.position.horizontalPosition.value}) answer:${answer.value}`
    // );
    if (this.isAnswered && !this._answer?.equals(answer))
      BusinessError.throw(
        Cell.name,
        this.setAnswer.name,
        `解答済みのCellです。position:(${this.position.verticalPosition.value}, ${this.position.horizontalPosition.value}) answer:${answer.value} this._answer:${this._answer?.value}`,
      );
    if (!this.hasAnswerCandidate(AnswerCandidate.create(answer.value))) {
      // BusinessError.throw(
      //   Cell.name,
      //   this.setAnswer.name,
      //   `答えの候補にない値を指定されました。position:(${this.position.verticalPosition.value}, ${this.position.horizontalPosition.value}) answer:${answer.value} `
      // );
      // console.log(
      //   `答えの候補にない値を指定されました。position:(${this.position.verticalPosition.value}, ${this.position.horizontalPosition.value}) answer:${answer.value} `
      // );
      return;
    }
    this._answer = answer;
  }

  public clearAnswerCandidateList() {
    this.answerCandidateList.clear();
  }

  public get answer(): Answer | undefined {
    return this._answer;
  }

  /**
   * 解答済みのCellであるかどうかを判定する。
   */
  public get isAnswered(): boolean {
    return !!this._answer;
  }

  public getAnswer(): Answer | undefined {
    return this._answer;
  }

  public getAnswerCandidateStringArray(): string[] {
    return this.answerCandidateList.getAnswerCandidateStringArray();
  }

  public getAnswerCandidateIterator(): AnswerCandidate[] {
    return this.answerCandidateList.getAnswerCandidateIterator();
  }

  /**
   * 本Cellの答え候補のリストに引数で受けとった答え候補が含まれるかを判定する。
   * @param target 答え候補
   */
  public hasAnswerCandidate(target: AnswerCandidate): boolean {
    return this.answerCandidateList.has(target);
  }

  /**
   * 本Cellのポジションと引数で受けとったポジションが同じであるかどうかを判定する。
   * @param position ポジション
   */
  public isSamePosition(position: CellPosition): boolean {
    return this.position.equals(position);
  }

  /**
   * 本Cellが、指定された縦位置であるかを判定する。
   * @param vPos 縦位置
   */
  public isSameVerticalPosition(vPos: VerticalPosition): boolean {
    return this.position.isSameVerticalPosition(vPos);
  }

  /**
   * 本Cellが、指定された水平位置であるかを判定する
   * @param hPos 水平位置
   */
  public isSameHorizontalPosition(hPos: HorizontalPosition): boolean {
    return this.position.isSameHorizontalPosition(hPos);
  }
}
