import GroupRepository from '@/core/repository/groupRepository';
import Group, { GroupType } from '@/core/entity/group';
import GroupID from '@/core/valueobject/groupId';
import RepositoryError from '@/repository/repositoryError';
import GameID from '@/core/valueobject/gameId';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';

export default class GroupRepositoryImpl implements GroupRepository {
  public static create(): GroupRepositoryImpl {
    return new GroupRepositoryImpl();
  }
  constructor() {}
  public static groupMap: Map<GameID, Group[]> = new Map<GameID, Group[]>();

  public regist(gameId: GameID, groups: Group[]): void {
    if (GroupRepositoryImpl.groupMap.has(gameId)) {
      GroupRepositoryImpl.groupMap.set(
        gameId,
        GroupRepositoryImpl.groupMap.get(gameId)!.concat(groups)
      );
    } else {
      GroupRepositoryImpl.groupMap.set(gameId, groups);
    }
  }
  public findAll(gameId: GameID): Group[] {
    return GroupRepositoryImpl.groupMap.get(gameId) ?? this.throw(gameId);
  }
  public find(gameId: GameID, groupID: GroupID): Group {
    return (
      GroupRepositoryImpl.groupMap
        .get(gameId)
        ?.find(group => group.isIdMatch(groupID)) ?? this.throw(gameId, groupID)
    );
  }

  public findByType(gameId: GameID, groupType: GroupType): Group[] {
    return (
      GroupRepositoryImpl.groupMap
        .get(gameId)
        ?.filter(group => group.groupType === groupType) ??
      this.throw(gameId, groupType)
    );
  }

  public findHorizontalGroupByVerticalPosition(
    gameId: GameID,
    verticalPosition: VerticalPosition
  ): Group {
    return (
      this.findByType(gameId, GroupType.Horizontal).find(group =>
        group.range
          .getVerticalPositions()
          .some(vPos => vPos.equals(verticalPosition))
      ) ?? this.throw(gameId, verticalPosition)
    );
  }
  public findVerticalGroupByHorizontalPosition(
    gameId: GameID,
    horizontalPosition: HorizontalPosition
  ): Group {
    return (
      this.findByType(gameId, GroupType.Vertical).find(group =>
        group.range
          .getHorizontalPositions()
          .some(vPos => vPos.equals(horizontalPosition))
      ) ?? this.throw(gameId, horizontalPosition)
    );
  }

  public remove(gameId: GameID): void {
    GroupRepositoryImpl.groupMap.delete(gameId);
  }

  public throw(gameId: GameID, arg2?: any): never {
    RepositoryError.throw(
      GroupRepositoryImpl.name,
      this.find.name,
      `お探しのGroupが見つかりません。 gameId:${JSON.stringify(gameId)} ${
        arg2 ? `arg2:${JSON.stringify(arg2)}` : ''
      }`
    );
  }
}
