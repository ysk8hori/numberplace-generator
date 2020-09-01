export default class Difficalty {
  public static create(value: number = 0): Difficalty {
    return new Difficalty(value);
  }
  private constructor(private _value: number = 0) {}
  public get value(): number {
    return this._value;
  }
  public increment(): Difficalty {
    return Difficalty.create(++this._value);
  }
}
