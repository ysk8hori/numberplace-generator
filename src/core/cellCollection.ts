import Cell from '@/core/entity/cell';
import CellPosition from '@/core/valueobject/cellPosition';
import CellNotFoundError from '@/core/cellNotFoundError';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';
import GroupID from '@/core/valueobject/groupId';

export default class CellCollection {
  public static create(cells: Cell[]): CellCollection {
    return new CellCollection(cells);
  }
  private constructor(private cells: Cell[]) {}

  /**
   * 指定した位置のCellを取得する
   * @param position 取得するCellの位置
   */
  public get(position: CellPosition): Cell {
    return (
      this.cells.find(cell => cell.isSamePosition(position)) ??
      CellNotFoundError.throw()
    );
  }
  /**
   * 指定した縦位置のCellを取得する
   * @param vPos 縦位置
   */
  public filterVerticalPosition(vPos: VerticalPosition): Cell[] {
    return this.cells.filter(cell => cell.isSameVerticalPosition(vPos));
  }
  /**
   * 指定した水平位置のCellを取得する
   * @param hPos 水平位置
   */
  public filterHorizontalPosition(hPos: HorizontalPosition): Cell[] {
    return this.cells.filter(cell => cell.isSameHorizontalPosition(hPos));
  }
  public findByGroup(groupId: GroupID): Cell[] {
    return this.cells.filter(cell =>
      cell.groupIds.some(cellGroupId => cellGroupId.equals(groupId)),
    );
  }
  public findAll(): Cell[] {
    return this.cells;
  }

  public get length(): number {
    return this.cells.length;
  }
}
