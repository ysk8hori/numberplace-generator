import Answer from '@/core/valueobject/answer';
import IAnswer from '@/core/valueobject/iAnswer';

/**
 * 1つのCellにおける答えの候補の１つ。
 * 例えばAnswerCandidateは、そのCellに１～９の数字のうち'1'が当てはまる可能性がある場合、その'1'を表す。
 * そのCellに1～9の全ての数値が当てはまる可能性がある場合、Cellは1～9の9個のAnswerCandidateを持つことになる。
 *
 * AnswerCandidateは、数値でなくても成り立つため文字列としている。
 */
export default class AnswerCandidate implements IAnswer {
  public get value(): string {
    return this._value;
  }
  private constructor(private _value: string) {}
  public static create(value: string): AnswerCandidate {
    return new AnswerCandidate(value);
  }
  public equals(other: IAnswer): boolean {
    return this.value === other.value;
  }
  public toAnswer(): Answer {
    return Answer.create(this.value);
  }
}
