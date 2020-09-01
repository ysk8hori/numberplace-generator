import CellPosition from '@/core/valueobject/cellPosition';
import RepositoryError from '@/repository/repositoryError';
import GameID from '@/core/valueobject/gameId';
import UserCellRepository from '@/application/repository/userCellRepository';
import UserCell from '@/application/entity/userCell';

/**
 * Game生成時のCellの保存、及びCellの取り出しを可能とするリポジトリ。
 */
export default class UserCellRepositoryImpl implements UserCellRepository {
  /**
   * CellRepositoryのインスタンスを生成する
   */
  public static create(): UserCellRepository {
    return new UserCellRepositoryImpl();
  }
  public constructor() {}
  private static cellCollectionMap: Map<GameID, UserCell[]> = new Map<
    GameID,
    UserCell[]
  >();
  public findAll(gameId: GameID): UserCell[] {
    return UserCellRepositoryImpl.cellCollectionMap.get(gameId) ?? this.throw();
  }
  public findByPosition(gameId: GameID, position: CellPosition): UserCell {
    return (
      UserCellRepositoryImpl.cellCollectionMap
        .get(gameId)
        ?.find(userCell => userCell.position.equals(position)) ?? this.throw()
    );
  }
  public findSelectedCell(gameId: GameID): UserCell | undefined {
    return UserCellRepositoryImpl.cellCollectionMap
      .get(gameId)
      ?.find(userCell => userCell.isSelected);
  }

  public push(gameId: GameID, userCell: UserCell): void {
    if (!UserCellRepositoryImpl.cellCollectionMap.has(gameId)) {
      UserCellRepositoryImpl.cellCollectionMap.set(
        gameId,
        new Array<UserCell>()
      );
    }
    UserCellRepositoryImpl.cellCollectionMap.get(gameId)!.push(userCell);
  }
  public clear(gameId: GameID): void {
    UserCellRepositoryImpl.cellCollectionMap.delete(gameId);
  }

  private throw(): never {
    return RepositoryError.throw(
      UserCellRepositoryImpl.name,
      this.findByPosition.name,
      'CellCollectionが登録される前に検索処理が実行されました。'
    );
  }
}
