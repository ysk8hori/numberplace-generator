import Group, { GroupType } from '@/core/entity/group';
import VerticalPosition, { vPos } from '@/core/valueobject/verticalPosition';
import { Height, createHeight } from '@/core/valueobject/height';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import HorizontalPosition, {
  hPos,
} from '@/core/valueobject/horizontalPosition';
import { Width, createWidth } from '@/core/valueobject/width';
import Utils from '@/utils/utils';
import CellPosition from '@/core/valueobject/cellPosition';
import CellCollection from '@/core/cellCollection';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import GroupID from '@/core/valueobject/groupId';
import GroupRepository from '@/core/repository/groupRepository';
import GameID from '@/core/valueobject/gameId';
import CellRepository from '@/core/repository/cellRepository';
import { container } from 'tsyringe';
import { GameType } from '../types';
import BusinessError from '../businessError';

export default class GroupFactory {
  public static create(
    gameId: GameID,
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
    option?: { gameTypes?: GameType[] },
  ): GroupFactory {
    return new GroupFactory(gameId, baseHeight, baseWidth, {
      ...{ gameTypes: ['standard'] },
      ...option,
    });
  }
  public constructor(
    private gameId: GameID,
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    private option: { gameTypes: GameType[] },
    private cellRepository: CellRepository = container.resolve(
      'CellRepository',
    ),
    private groupRepository: GroupRepository = container.resolve(
      'GroupRepository',
    ),
  ) {
    this.answerCandidateCollection = AnswerCandidateCollection.create(
      this.baseHeight,
      this.baseWidth,
    );
    this.cellCollection = CellCollection.create(
      this.cellRepository!.findAll(this.gameId),
    );
  }
  private cellCollection: CellCollection;

  private answerCandidateCollection: AnswerCandidateCollection;

  public createGroups() {
    this.createHorizontalGroup();
    this.createVerticalGroup();
    this.createSquareGroup();
    if (this.option.gameTypes.includes('cross')) this.createCrossGroup();
    if (this.option.gameTypes.includes('hyper')) this.createHyperGroup();
  }

  /**
   * 縦グループを生成する。
   */
  public createVerticalGroup(): Group[] {
    const groups = HorizontalPosition.createAll(
      createWidth(this.baseHeight, this.baseWidth),
    ).reduce((previous, currentPosition) => {
      const groupId = this.createId(
        this.gameId,
        GroupType.Vertical,
        this.vIdNumber++,
      );
      this.cellCollection
        .filterHorizontalPosition(currentPosition)
        .forEach(cell => cell.joinGroup(groupId));
      previous.push(
        Group.create(
          this.gameId,
          GroupType.Vertical,
          groupId,
          this.answerCandidateCollection.clone(),
        ),
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
    const groups = VerticalPosition.createAll(
      createHeight(this.baseHeight, this.baseWidth),
    ).reduce((previous, currentPosition) => {
      const groupId = this.createId(
        this.gameId,
        GroupType.Horizontal,
        this.hIdNumber++,
      );
      this.cellCollection
        .filterVerticalPosition(currentPosition)
        .forEach(cell => cell.joinGroup(groupId));
      previous.push(
        Group.create(
          this.gameId,
          GroupType.Horizontal,
          groupId,
          this.answerCandidateCollection.clone(),
        ),
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
            this.sIdNumber++,
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
              this.answerCandidateCollection.clone(),
            ),
          );
        },
      ),
    );
    this.groupRepository!.regist(this.gameId, squareGroups);
    return squareGroups;
  }
  private sIdNumber = 0;

  /** スクウェアグループの範囲の全てのCellPositionをリストで取得する */
  private createSquareRange(
    horizontalGroupCount: number,
    verticalGroupCount: number,
  ): CellPosition[] {
    return CellPosition.createSquareRange(
      // スクウェアグループの開始位置
      CellPosition.create(
        vPos(verticalGroupCount * this.baseHeight.value),
        hPos(horizontalGroupCount * this.baseWidth.value),
      ),
      // スクウェアグループの横幅
      this.baseWidth.value,
      // スクウェアグループの高さ
      this.baseHeight.value,
    );
  }

  public createCrossGroup(): Group[] {
    // 左上から右下への斜めのグループ
    const groupId1 = this.createId(this.gameId, GroupType.Cross, 0);
    const crossGroup1 = Group.create(
      this.gameId,
      GroupType.Cross,
      groupId1,
      this.answerCandidateCollection.clone(),
    );
    Utils.createArray(this.baseHeight.value * this.baseWidth.value)
      .map(i => CellPosition.create(vPos(i), hPos(i)))
      .map(pos =>
        this.cellCollection.findAll().find(v => v.position.equals(pos)),
      )
      .forEach(cell => cell!.joinGroup(groupId1));
    this.groupRepository!.regist(this.gameId, [crossGroup1]);

    // 右上から左下への斜めのグループ
    const groupId2 = this.createId(this.gameId, GroupType.Cross, 1);
    const crossGroup2 = Group.create(
      this.gameId,
      GroupType.Cross,
      groupId2,
      this.answerCandidateCollection.clone(),
    );
    Utils.createArray(this.baseHeight.value * this.baseWidth.value)
      .map(i =>
        CellPosition.create(
          vPos(i),
          hPos(this.baseHeight.value * this.baseWidth.value - i - 1),
        ),
      )
      .map(pos =>
        this.cellCollection.findAll().find(v => v.position.equals(pos)),
      )
      .forEach(cell => cell!.joinGroup(groupId2));
    this.groupRepository!.regist(this.gameId, [crossGroup2]);

    return [crossGroup1, crossGroup2];
  }

  public static readonly HYPER_GROUP_POSITIONS = [
    [
      CellPosition.c(1, 1),
      CellPosition.c(2, 1),
      CellPosition.c(3, 1),
      CellPosition.c(1, 2),
      CellPosition.c(2, 2),
      CellPosition.c(3, 2),
      CellPosition.c(1, 3),
      CellPosition.c(2, 3),
      CellPosition.c(3, 3),
    ],
    [
      CellPosition.c(5, 1),
      CellPosition.c(6, 1),
      CellPosition.c(7, 1),
      CellPosition.c(5, 2),
      CellPosition.c(6, 2),
      CellPosition.c(7, 2),
      CellPosition.c(5, 3),
      CellPosition.c(6, 3),
      CellPosition.c(7, 3),
    ],
    [
      CellPosition.c(1, 5),
      CellPosition.c(2, 5),
      CellPosition.c(3, 5),
      CellPosition.c(1, 6),
      CellPosition.c(2, 6),
      CellPosition.c(3, 6),
      CellPosition.c(1, 7),
      CellPosition.c(2, 7),
      CellPosition.c(3, 7),
    ],
    [
      CellPosition.c(5, 5),
      CellPosition.c(6, 5),
      CellPosition.c(7, 5),
      CellPosition.c(5, 6),
      CellPosition.c(6, 6),
      CellPosition.c(7, 6),
      CellPosition.c(5, 7),
      CellPosition.c(6, 7),
      CellPosition.c(7, 7),
    ],
  ];

  /**
   * 9x9 の場合のみ機能する
   */
  public createHyperGroup(): Group[] {
    if (!(this.baseHeight.value === 3 && this.baseWidth.value === 3)) {
      BusinessError.throw(
        GroupFactory.name,
        'createHyperGroup',
        'hyper は baseWidth:3 baseHeight:3 の問題以外では作成できません',
      );
    }
    return GroupFactory.HYPER_GROUP_POSITIONS.map((groupCellPoses, i) => {
      // groupId を作り、Cell を GroupId と紐付けし、Group を生成し、groupRepository に登録し、Groupをリターンする。
      const groupId = this.createId(this.gameId, GroupType.Hyper, i);
      this.cellCollection
        .findAll()
        .filter(cell => groupCellPoses.some(pos => pos.equals(cell.position)))
        .forEach(cell => cell.joinGroup(groupId));
      const group = Group.create(
        this.gameId,
        GroupType.Hyper,
        groupId,
        this.answerCandidateCollection.clone(),
      );
      this.groupRepository!.regist(this.gameId, [group]);
      return group;
    });
  }

  private createId(
    gameId: GameID,
    groupType: GroupType,
    idNumber: number,
  ): GroupID {
    return GroupID.create(gameId, idNumber.toString(), groupType);
  }
}
