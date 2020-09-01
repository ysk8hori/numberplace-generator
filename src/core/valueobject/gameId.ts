import { v4 } from 'uuid';
export default class GameID {
  // public static readonly uuid = require('uuid/v4');
  private constructor(private _value: string) {}
  public static create(): GameID {
    return new GameID(v4());
  }
  public equals(other: GameID): boolean {
    return this._value === other._value;
  }
  public get value(): string {
    return this._value;
  }
}
