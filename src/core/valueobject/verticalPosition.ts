import Height from '@/core/valueobject/height';
import Utils from '@/utils/utils';
import CellPosition from '@/core/valueobject/cellPosition';

/**
 * GameBoardにおけるCellの縦位置。
 * 9x9(Base 3x3)のGameBoardの場合は、0～8の位置がある。
 */
export default class VerticalPosition {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  /**
   * 指定したHeightの幅分すべてのVerticalPositionを生成する。
   * @param height ゲームボードの高さ
   */
  public static create(height: Height): VerticalPosition[];
  /**
   * VerticalPosition
   * @param value 縦位置
   */
  public static create(value: number): VerticalPosition;
  public static create(
    arg: number | Height
  ): VerticalPosition | VerticalPosition[] {
    return arg instanceof Height
      ? Utils.createArray(arg.value).map(index =>
          VerticalPosition.create(index)
        )
      : new VerticalPosition(arg);
  }
  /** 等価比較 */
  public equals(other: VerticalPosition): boolean {
    return this.value === other.value;
  }
  /**
   * 縦方向に移動する
   * @param count 移動する距離
   */
  public move(count: number): VerticalPosition {
    this._value = this.value + count;
    return this;
  }

  public compare(other: VerticalPosition): -1 | 0 | 1 {
    if (this.value - other.value < 0) {
      return -1;
    } else if (this.value - other.value === 0) {
      return 0;
    } else {
      return 1;
    }
  }

  public clone(): VerticalPosition {
    return VerticalPosition.create(this.value);
  }
}
export function vPos(pos: number): VerticalPosition {
  return VerticalPosition.create(pos);
}
