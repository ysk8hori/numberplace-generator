import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

/**
 * GameBoard全体の横幅
 */
export default class Width {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  public static create(baseHeight: BaseHeight, baseWidth: BaseWidth): Width {
    return new Width(baseHeight.value * baseWidth.value);
  }
  public equals(other: Width): boolean {
    return this.value === other.value;
  }
}
