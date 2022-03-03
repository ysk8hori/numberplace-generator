import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

/**
 * GameBoard全体の縦幅
 */
export default class Height {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  public static create(baseHeight: BaseHeight, baseWidth: BaseWidth): Height {
    return new Height(baseHeight.value * baseWidth.value);
  }
  public equals(other: Height): boolean {
    return this.value === other.value;
  }

  public static validation(
    baseHeight: number,
    baseWidth: number,
  ): boolean | string {
    const oneSideLength = baseHeight * baseWidth;
    return Number.isNaN(oneSideLength)
      ? 'Please chose base-height and base-width.'
      : oneSideLength < 10
      ? true
      : 'Please chose smaller size.';
  }
}
