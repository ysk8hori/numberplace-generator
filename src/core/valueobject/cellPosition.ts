import HorizontalPosition, { hPos } from './horizontalPosition';
import VerticalPosition, { vPos } from './verticalPosition';
import Width from '@/core/valueobject/width';
import Height from '@/core/valueobject/height';

/**
 * GameBoardにおけるCellの位置を表すクラス。
 * HorizontalPositionとVerticalPositionによって位置を表す。
 */
export default class CellPosition {
  /**
   * 数値でポジションを指定してインスタンスを生成する
   * @param horizontalPosition 数値の水平位置
   * @param verticalPosition 数値の縦位置
   * @deprecated 使用しないでください。
   *
   * 本メソッドではなく、createメソッドを使用してください。
   */
  public static createFromNumber(
    horizontalPosition: number,
    verticalPosition: number,
  ): CellPosition {
    return new CellPosition(vPos(verticalPosition), hPos(horizontalPosition));
  }

  public static create(
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition,
  ): CellPosition {
    return new CellPosition(verticalPosition, horizontalPosition);
  }

  public static createSquareRange(
    startingPoint: CellPosition,
    horizontalRange: number,
    verticalRange: number,
  ): CellPosition[] {
    const cellPositions: CellPosition[] = [];
    for (
      let hPosVal = startingPoint.horizontalPosition.value;
      hPosVal < startingPoint.horizontalPosition.value + horizontalRange;
      hPosVal++
    ) {
      for (
        let vPosVal = startingPoint.verticalPosition.value;
        vPosVal < startingPoint.verticalPosition.value + verticalRange;
        vPosVal++
      ) {
        cellPositions.push(CellPosition.create(vPos(vPosVal), hPos(hPosVal)));
      }
    }
    return cellPositions;
  }

  public static *generate(
    width: Width,
    height: Height,
  ): Generator<CellPosition, void, unknown> {
    for (const vPos of VerticalPosition.create(height)) {
      for (const hPos of HorizontalPosition.create(width)) {
        yield CellPosition.create(vPos, hPos);
      }
    }
  }

  /** コンストラクタ */
  private constructor(
    private _verticalPosition: VerticalPosition,
    private _horizontalPosition: HorizontalPosition,
  ) {}

  public get verticalPosition(): VerticalPosition {
    return this._verticalPosition;
  }
  public get horizontalPosition(): HorizontalPosition {
    return this._horizontalPosition;
  }

  /** インスタンスを複製する */
  public clone(): CellPosition {
    return CellPosition.create(this.verticalPosition, this.horizontalPosition);
  }

  /** 等価比較 */
  public equals(other: CellPosition): boolean {
    return (
      this.horizontalPosition.equals(other.horizontalPosition) &&
      this.verticalPosition.equals(other.verticalPosition)
    );
  }

  /**
   * インスタンスが指定された縦位置であるかを判定する。
   * @param vPos 縦位置
   */
  public isSameVerticalPosition(vPos: VerticalPosition): boolean {
    return this.verticalPosition.equals(vPos);
  }

  /**
   * インスタンスが指定された水平位置であるかを判定する
   * @param hPos 水平位置
   */
  public isSameHorizontalPosition(hPos: HorizontalPosition): boolean {
    return this.horizontalPosition.equals(hPos);
  }

  public compareByRow(other: CellPosition): -1 | 0 | 1 {
    return this.verticalPosition.compare(other.verticalPosition);
  }

  public compareByCol(other: CellPosition): -1 | 0 | 1 {
    return this.horizontalPosition.compare(other.horizontalPosition);
  }

  public toString(): string {
    return `(${this._verticalPosition.value}, ${this._horizontalPosition.value})`;
  }
}
export function pos(
  verticalPosition: number,
  horizontalPosition: number,
): CellPosition {
  return CellPosition.create(
    VerticalPosition.create(verticalPosition),
    HorizontalPosition.create(horizontalPosition),
  );
}
