import CellPosition from '@/core/valueobject/cellPosition';
import Answer from '@/core/valueobject/answer';

/**
 * 確定できないセルに仮で入力する値
 */
export default class TentativeDecision {
  constructor(public cellPosition: CellPosition, public answer: Answer) {}
}
