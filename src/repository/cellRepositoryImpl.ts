import Cell from '@/core/entity/cell';
import CellRepository from '@/core/repository/cellRepository';
import CellPosition from '@/core/valueobject/cellPosition';
import CellCollection from '@/core/cellCollection';
import RepositoryError from '@/repository/repositoryError';
import GroupID from '@/core/valueobject/groupId';
import GameID from '@/core/valueobject/gameId';

/**
 * Game生成時のCellの保存、及びCellの取り出しを可能とするリポジトリ。
 */
export default class CellRepositoryImpl implements CellRepository {
  /**
   * CellRepositoryのインスタンスを生成する
   */
  public static create(): CellRepository {
    return new CellRepositoryImpl();
  }
  static count = 0;
  public constructor() {}
  private static cellCollectionMap: Map<GameID, CellCollection> = new Map<
    GameID,
    CellCollection
  >();
  public regist(gameId: GameID, cellCollection: CellCollection): void {
    CellRepositoryImpl.cellCollectionMap.set(gameId, cellCollection);
  }
  public findByPosition(gameId: GameID, position: CellPosition): Cell {
    return (
      CellRepositoryImpl.cellCollectionMap.get(gameId)?.get(position) ??
      this.throw()
    );
  }
  public findByGroup(gameId: GameID, groupId: GroupID): Cell[] {
    return (
      CellRepositoryImpl.cellCollectionMap.get(gameId)?.findByGroup(groupId) ??
      this.throw()
    );
  }
  public findAll(gameId: GameID): Cell[] {
    return (
      CellRepositoryImpl.cellCollectionMap.get(gameId)?.findAll() ??
      this.throw()
    );
  }

  public getMinimumAnswerCountCells(gameId: GameID): Cell[] {
    return this.findAll(gameId).filter(cell =>
      this.isMinimum(cell, this.getMinimumAnswerCandidateCount(gameId))
    );
  }

  private isMinimum(cell: Cell, minimumAnswerCandidateCount: number): boolean {
    if (cell.isAnswered) return false;
    return (
      cell.getAnswerCandidateStringArray().length ===
      minimumAnswerCandidateCount
    );
  }

  /**
   * 全てのセルのうち、最も答え候補の少ないセルの答え候補の数を取得する。
   */
  private getMinimumAnswerCandidateCount(gameId: GameID) {
    let minimumAnswerCandidateLength = Number.MAX_SAFE_INTEGER;
    this.findAll(gameId).forEach(cell => {
      if (
        !cell.isAnswered &&
        cell.getAnswerCandidateStringArray().length <
          minimumAnswerCandidateLength
      ) {
        minimumAnswerCandidateLength =
          cell.getAnswerCandidateStringArray().length;
      }
    });
    return minimumAnswerCandidateLength;
  }
  public remove(gameId: GameID): void {
    CellRepositoryImpl.cellCollectionMap.delete(gameId);
  }

  private throw(): never {
    return RepositoryError.throw(
      CellRepositoryImpl.name,
      this.findByPosition.name,
      'CellCollectionが登録される前に検索処理が実行されました。'
    );
  }
}
