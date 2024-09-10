import type { Cell } from "./cell.ts";

export type History = {
  cell: Cell;
  answerCandidates: number[];
};
