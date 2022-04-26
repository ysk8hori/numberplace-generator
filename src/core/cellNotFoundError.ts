import CellPosition from '@/core/valueobject/cellPosition';

export default class CellNotFoundError implements Error {
  public readonly name: string = 'CellNotFoundError';
  public readonly _message: string = 'お探しのCellが見つかりませんでした。';
  public message = '';
  constructor(public posistion?: CellPosition) {
    this.message = `${this._message} ${
      this.posistion && `[${this.posistion}]`
    }`;
  }
  public static throw(position?: CellPosition): never {
    throw new CellNotFoundError(position);
  }
}
