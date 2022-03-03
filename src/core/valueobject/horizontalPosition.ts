import Width from '@/core/valueobject/width';
import Utils from '@/utils/utils';

/**
 * GameBoardにおけるCellの横位置。
 * 9*9(Baseなら3*3)のGameBoardの場合は、0～8の位置がある。
 */
export default class HorizontalPosition {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  /**
   * 指定したWidthの幅分すべてのHorizontalPositionを生成する。
   * @param width ゲームボードの幅
   */
  public static create(width: Width): HorizontalPosition[];
  /**
   * 水平位置を指定してHorizontalPositionを生成する。
   * @param value 水平位置
   */
  public static create(value: number): HorizontalPosition;
  public static create(
    arg: number | Width,
  ): HorizontalPosition | HorizontalPosition[] {
    return arg instanceof Width
      ? Utils.createArray(arg.value).map(index =>
          HorizontalPosition.create(index),
        )
      : new HorizontalPosition(arg);
  }
  public equals(horizontalPosition: HorizontalPosition): boolean {
    return this.value === horizontalPosition.value;
  }
  /**
   * 横方向に移動する
   * @param value 移動する距離
   */
  public move(value: number): HorizontalPosition {
    this._value = this.value + value;
    return this;
  }

  public compare(other: HorizontalPosition): -1 | 0 | 1 {
    if (this.value - other.value < 0) {
      return -1;
    } else if (this.value - other.value === 0) {
      return 0;
    } else {
      return 1;
    }
  }

  public clone(): HorizontalPosition {
    return HorizontalPosition.create(this.value);
  }
}
export function hPos(pos: number): HorizontalPosition {
  return HorizontalPosition.create(pos);
}
