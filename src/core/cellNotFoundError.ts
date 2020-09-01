import CellPosition from '@/core/valueobject/cellPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';
import VerticalPosition from '@/core/valueobject/verticalPosition';

export default class CellNotFoundError implements Error {
  public readonly name: string = 'CellNotFoundError';
  public readonly message: string = 'お探しのCellが見つかりませんでした。';
  constructor(public posistion: CellPosition) {}
  public static throw(): never {
    throw new CellNotFoundError(
      CellPosition.create(
        VerticalPosition.create(0),
        HorizontalPosition.create(0)
      )
    );
  }
}
