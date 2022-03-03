import Group, { GroupType } from '@/core/entity/group';
import GroupID from '@/core/valueobject/groupId';
import GameID from '@/core/valueobject/gameId';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';

export default interface GroupRepository {
  regist(gameId: GameID, groups: Group[]): void;
  findAll(gameId: GameID): Group[];
  find(gameId: GameID, groupID: GroupID): Group;
  findByType(gameId: GameID, groupType: GroupType): Group[];
  findHorizontalGroupByVerticalPosition(
    gameId: GameID,
    verticalPosition: VerticalPosition,
  ): Group;
  findVerticalGroupByHorizontalPosition(
    gameId: GameID,
    horizontalPosition: HorizontalPosition,
  ): Group;
  remove(gameId: GameID): void;
}
