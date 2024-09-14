import type { Cell } from './cell.ts';

/** Internal type */
export type History = {
  cell: Cell;
  answerCandidates: number[];
};
