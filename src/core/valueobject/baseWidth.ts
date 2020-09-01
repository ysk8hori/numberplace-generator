/**
 * SquareGroupの横幅
 */
export default class BaseWidth {
  public get value(): number {
    return this._value;
  }
  private constructor(private _value: number) {}
  public static create(value: number): BaseWidth {
    return new BaseWidth(value);
  }
  public equals(other: BaseWidth): boolean {
    return this.value === other.value;
  }

  public static selectableValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
