import GameID from '@/core/valueobject/gameId';
import { GroupType } from '@/core/entity/group';
import BusinessError from '@/core/businessError';

export default class GroupID {
  public static create(
    gameId: GameID,
    idString: string,
    type?: GroupType,
  ): GroupID {
    return new GroupID(gameId, idString, type);
  }

  private constructor(
    private gameId: GameID,
    private _idString: string,
    private _type?: GroupType,
  ) {
    this._idString = _type ? `${_type}${_idString}` : _idString;
    this._type = _type ? _type : this.getTypeFromId();
  }
  public get type(): GroupType | undefined {
    return this._type;
  }
  public get idString(): string {
    return this._idString;
  }
  public equals(other: GroupID): boolean {
    return (
      this.idString === other.idString &&
      this.gameId.equals(other.gameId) &&
      this.type === other.type
    );
  }
  private getTypeFromId(): GroupType {
    switch (this.idString[0]) {
      case GroupType.Horizontal:
      case GroupType.Square:
      case GroupType.Vertical:
        return this.idString[0];
      default:
        BusinessError.throw(
          GroupID.name,
          this.getTypeFromId.name,
          `IDが不正です。 id:${this.idString}`,
        );
    }
  }
}
