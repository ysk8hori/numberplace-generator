import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

export default class GameSize {
  public static MAX_SIZE = 10;
  public static MIN_SIZE = 3;
  public static create(
    baseHeight: number,
    baseWidth: number,
  ): GameSize | string {
    const oneSideLength = baseHeight * baseWidth;
    return Number.isNaN(oneSideLength)
      ? 'Please chose base-height and base-width.'
      : GameSize.MAX_SIZE < oneSideLength
      ? 'Please chose smaller size.'
      : oneSideLength < GameSize.MIN_SIZE
      ? 'Please chose larger size.'
      : new GameSize(
          BaseHeight.create(baseHeight),
          BaseWidth.create(baseWidth),
        );
  }
  constructor(private _baseHeight: BaseHeight, private _baseWidth: BaseWidth) {}
  public get size(): number {
    return this.baseHeight.value * this.baseWidth.value;
  }
  public get gameSizeString(): string {
    return `${this.size} x ${this.size}`;
  }
  public get baseWidth(): BaseWidth {
    return this._baseWidth;
  }
  public get baseHeight(): BaseHeight {
    return this._baseHeight;
  }
}
