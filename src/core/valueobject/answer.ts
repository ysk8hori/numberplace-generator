import IAnswer from '@/core/valueobject/iAnswer';

/**
 * 1つのCellにおける答え。
 *
 * Answerは、数値でなくても成り立つため文字列としている。
 */
export default class Answer implements IAnswer {
  public get value(): string {
    return this._value;
  }
  private constructor(private _value: string) {}
  public static create(value: string | number): Answer {
    return new Answer(typeof value === 'string' ? value : value.toString());
  }
  public equals(answer: IAnswer): boolean {
    return this.value === answer.value;
  }
}
