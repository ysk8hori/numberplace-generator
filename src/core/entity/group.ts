import Cell from './cell';
import IAnswer from '@/core/valueobject/iAnswer';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import FillLonelyLogic from '@/core/logic/analyze/fillLonelyLogic';
import GroupID from '@/core/valueobject/groupId';
import CellRepository from '@/core/repository/cellRepository';
import CellNotFoundError from '@/core/cellNotFoundError';
import GameID from '@/core/valueobject/gameId';
import Range from '@/core/range';
import RepositoryError from '@/repository/repositoryError';
import { container } from 'tsyringe';

export default class Group {
  public static create(
    gameId: GameID,
    groupType: GroupType,
    groupId: GroupID,
    answerCandidateCollection: AnswerCandidateCollection,
  ): Group {
    return new Group(gameId, groupType, groupId, answerCandidateCollection);
  }

  public constructor(
    public gameId: GameID,
    private _groupType: GroupType,
    private _groupId: GroupID,
    public answerCandidateCollection: AnswerCandidateCollection,
    private cellRepository: CellRepository = container.resolve(
      'CellRepository',
    ),
  ) {
    this._range = Range.create(
      gameId,
      this.cellRepository
        ?.findByGroup(this.gameId, this.groupId)
        .map(cell => cell.position) ??
        RepositoryError.throwNoRepository(Group.name, 'constructor'),
    );
  }

  private _range: Range;
  public get range(): Range {
    return this._range;
  }

  public onAnswered(answer: IAnswer) {
    this.answerCandidateCollection.removeCandidate(answer);
    this.cells.forEach(cell => {
      cell.removeCandidate(answer);
    });
  }
  /**
   * 候補の値を持つCellがグループ内に1つの場合、そのCellの答えを候補の値で決定する。
   * それを各候補全てに対して行う。
   */
  public fillLonely(): void {
    FillLonelyLogic.create(this.gameId, this.groupId).do();
  }

  public isIdMatch(gourpId: GroupID): boolean {
    return this.groupId.equals(gourpId);
  }

  public get cells(): Cell[] {
    return (
      this.cellRepository?.findByGroup(this.gameId, this.groupId) ??
      CellNotFoundError.throw()
    );
  }

  /** グループのタイプ */
  public get groupType(): GroupType {
    return this._groupType;
  }
  public get groupId(): GroupID {
    return this._groupId;
  }
}

export enum GroupType {
  Vertical = 'v',
  Horizontal = 'h',
  Square = 's',
  Cross = 'x',
}
