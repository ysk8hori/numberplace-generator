import type { Answer, AnswerCandidate } from './cell.ts';
import type { Position } from './position.ts';

/** Internal type */
export type History = {
  pos: Position;
  answer: Answer;
  answerCandidatesMut: AnswerCandidate[];
  isTemporaryInput: true;
} | {
  pos: Position;
  answer: Answer;
  isTemporaryInput: false;
};
