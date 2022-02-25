import Group, { GroupType } from '@/core/entity/group';
import VerticalPosition, { vPos } from '@/core/valueobject/verticalPosition';
import Height from '@/core/valueobject/height';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import HorizontalPosition, {
  hPos,
} from '@/core/valueobject/horizontalPosition';
import Width from '@/core/valueobject/width';
import Utils from '@/utils/utils';
import CellPosition from '@/core/valueobject/cellPosition';
import CellCollection from '@/core/cellCollection';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import GroupID from '@/core/valueobject/groupId';
import GroupRepository from '@/core/repository/groupRepository';
import GameID from '@/core/valueobject/gameId';
import CellRepository from '@/core/repository/cellRepository';
import { autoInjectable, inject } from 'tsyringe';

@autoInjectable()
export default class GroupFactory {
  public static create(
    gameId: GameID,
    baseHeight: BaseHeight,
    baseWidth: BaseWidth
  ): GroupFactory {
    return new GroupFactory(gameId, baseHeight, baseWidth);
  }
  public constructor(
    private gameId: GameID,
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    @inject('GroupRepository')
    private groupRepository?: GroupRepository,
    @inject('CellRepository')
    private cellRepository?: CellRepository
  ) {
    this.answerCandidateCollection = AnswerCandidateCollection.create(
      this.baseHeight,
      this.baseWidth
    );
    this.cellCollection = CellCollection.create(
      this.cellRepository!.findAll(this.gameId)
    );
  }
  private cellCollection: CellCollection;

  private answerCandidateCollection: AnswerCandidateCollection;

  public createGroups() {
    this.createHorizontalGroup();
    this.createVerticalGroup();
    this.createSquareGroup();
  }

  /**
   * 縦グループを生成する。
   */
  public createVerticalGroup(): Group[] {
    const groups = HorizontalPosition.create(
      Width.create(this.baseHeight, this.baseWidth)
    ).reduce((previous, currentPosition) => {
      const groupId = this.createId(
        this.gameId,
        GroupType.Vertical,
        this.vIdNumber++
      );
      this.cellCollection
        .filterHorizontalPosition(currentPosition)
        .forEach(cell => cell.joinGroup(groupId));
      previous.push(
        Group.create(
          this.gameId,
          GroupType.Vertical,
          groupId,
          this.answerCandidateCollection.clone()
        )
      );
      return previous;
    }, new Array<Group>());
    this.groupRepository!.regist(this.gameId, groups);
    return groups;
  }
  private vIdNumber = 0;

  /**
   * 横グループを生成する。
   */
  public createHorizontalGroup(): Group[] {
    const groups = VerticalPosition.create(
      Height.create(this.baseHeight, this.baseWidth)
    ).reduce((previous, currentPosition) => {
      const groupId = this.createId(
        this.gameId,
        GroupType.Horizontal,
        this.hIdNumber++
      );
      this.cellCollection
        .filterVerticalPosition(currentPosition)
        .forEach(cell => cell.joinGroup(groupId));
      previous.push(
        Group.create(
          this.gameId,
          GroupType.Horizontal,
          groupId,
          this.answerCandidateCollection.clone()
        )
      );
      return previous;
    }, new Array<Group>());
    this.groupRepository!.regist(this.gameId, groups);
    return groups;
  }
  private hIdNumber = 0;

  /**
   * スクウェアグループを生成する。
   */
  public createSquareGroup(): Group[] {
    // 横方向のsquareグループの数は、baseHeightと同じになる。
    const maxHorizontalGroupCount = this.baseHeight.value;
    // 逆もしかり
    const maxVerticalGroupCount = this.baseWidth.value;
    const squareGroups: Group[] = [];
    Utils.createArray(maxVerticalGroupCount).forEach(verticalGroupCount =>
      Utils.createArray(maxHorizontalGroupCount).forEach(
        horizontalGroupCount => {
          const groupId = this.createId(
            this.gameId,
            GroupType.Square,
            this.sIdNumber++
          );
          // スクウェアグループのレンジに含まれる全てのCellポジションを作る
          this.createSquareRange(horizontalGroupCount, verticalGroupCount)
            .map(cellPos => this.cellCollection.get(cellPos))
            .forEach(cell => cell.joinGroup(groupId));
          squareGroups.push(
            Group.create(
              this.gameId,
              GroupType.Square,
              groupId,
              this.answerCandidateCollection.clone()
            )
          );
        }
      )
    );
    this.groupRepository!.regist(this.gameId, squareGroups);
    return squareGroups;
  }
  private sIdNumber = 0;

  /** スクウェアグループの範囲の全てのCellPositionをリストで取得する */
  private createSquareRange(
    horizontalGroupCount: number,
    verticalGroupCount: number
  ): CellPosition[] {
    return CellPosition.createSquareRange(
      // スクウェアグループの開始位置
      CellPosition.create(
        vPos(verticalGroupCount * this.baseHeight.value),
        hPos(horizontalGroupCount * this.baseWidth.value)
      ),
      // スクウェアグループの横幅
      this.baseWidth.value,
      // スクウェアグループの高さ
      this.baseHeight.value
    );
  }

  private createId(
    gameId: GameID,
    groupType: GroupType,
    idNumber: number
  ): GroupID {
    return GroupID.create(gameId, idNumber.toString(), groupType);
  }
}
