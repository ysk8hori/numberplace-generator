/**
 * SquareGroupの縦幅
 */
export default class BaseHeight {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  public static create(value: number): BaseHeight {
    return new BaseHeight(value);
  }
  public equals(other: BaseHeight): boolean {
    return this.value === other.value;
  }
  public static selectableValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
