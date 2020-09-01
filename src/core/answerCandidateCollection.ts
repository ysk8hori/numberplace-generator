import AnswerCandidate from '@/core/valueobject/answerCandidate';
import Utils from '@/utils/utils';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import IAnswer from '@/core/valueobject/iAnswer';
import BusinessError from '@/core/businessError';

/**
 * 一つのCellにおける全ての答えの候補を管理する。
 */
export default class AnswerCandidateCollection {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth
  ): AnswerCandidateCollection {
    return new AnswerCandidateCollection(
      Utils.createArray(baseHeight.value * baseWidth.value).map(
        candidateValue =>
          // candidateValueは0-originなので+1しとく
          AnswerCandidate.create((candidateValue + 1).toString())
      )
    );
  }
  private constructor(private answerCandidateList: AnswerCandidate[]) {}

  public clone(): AnswerCandidateCollection {
    return new AnswerCandidateCollection(Array.from(this.answerCandidateList));
  }

  public removeCandidate(removeValue: IAnswer) {
    this.answerCandidateList = this.answerCandidateList.filter(
      candidateValue => !candidateValue.equals(removeValue)
    );
  }

  public getAnswerCandidateStringArray(): string[] {
    return this.answerCandidateList.map(
      answerCandidate => answerCandidate.value
    );
  }

  public forEach(
    callbackfn: (
      value: AnswerCandidate,
      index: number,
      array: AnswerCandidate[]
    ) => void,
    thisArg?: any
  ): void {
    this.answerCandidateList.forEach(callbackfn);
  }

  /**
   * 指定した候補を持っているかを確認する。
   * @param target 候補
   */
  public has(target: AnswerCandidate): boolean {
    return this.answerCandidateList.some(value => value.equals(target));
  }

  public clear() {
    this.answerCandidateList = [];
  }

  /** 答えの候補が残り一つであることを判定する */
  public isLastOne(): boolean {
    return this.answerCandidateList.length === 1;
  }
  /** 残り一つの答えの候補を取得する */
  public getLastOne(): AnswerCandidate {
    return this.isLastOne
      ? this.answerCandidateList[0]
      : BusinessError.throw(
          AnswerCandidateCollection.name,
          this.getLastOne.name,
          'isLastOneで候補が1つになっていることを確認してから本メソッドを実行してください。'
        );
  }

  public get length(): number {
    return this.answerCandidateList.length;
  }

  public toString(): string {
    return this.answerCandidateList
      .map(answerCandidate => answerCandidate.value)
      .toString();
  }

  public getAnswerCandidateIterator(): AnswerCandidate[] {
    return this.answerCandidateList;
  }
}
