import Cell from '../entity/cell';
import CellPosition from '../valueobject/cellPosition';
import CellCollection from '@/core/cellCollection';
import GroupID from '@/core/valueobject/groupId';
import GameID from '@/core/valueobject/gameId';
import VerticalPosition from '@/core/valueobject/verticalPosition';

/**
 * Game生成時のCellの保存、及びCellの取り出しを可能とするリポジトリ。
 */
export default interface CellRepository {
  /**
   * game開始時に全てのCellを登録する。
   * @param gameId
   * @param cellCollection 全Cell
   */
  regist(gameId: GameID, cellCollection: CellCollection): void;
  /**
   * ポジションを指定してCellを取得する
   * @param gameId
   * @param position Cellのポジション
   */
  findByPosition(gameId: GameID, position: CellPosition): Cell;

  findByGroup(gameId: GameID, groupId: GroupID): Cell[];

  findAll(gameId: GameID): Cell[];

  /**
   * 指定したゲーム内で最も残りの答え候補が少ないセルを取得する。
   * @param gameId
   */
  getMinimumAnswerCountCells(gameId: GameID): Cell[];

  remove(gameId: GameID): void;
}
