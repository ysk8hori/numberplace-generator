import { pipe, map, isArray } from "remeda";
import type { Group } from "./group.ts";
import { createPositions, type Position } from "./position.ts";
import { createGameRange, type BlockSize } from "./game.ts";
import { getHorizontalGroup, getVerticalGroup } from "./group.ts";

export type Answer = number;
export type AnswerCandidate = number;

/** Internal type */
export type Cell = {
  pos: Position;
  answerMut: undefined | Answer;
  answerCnadidatesMut: AnswerCandidate[];
  groups: Group[];
};

export const createCell: (
  answerCnadidatesMut: AnswerCandidate[],
) => (pos: Position) => Cell = (answerCnadidatesMut) => (pos) => ({
  answerMut: undefined,
  answerCnadidatesMut,
  groups: [getVerticalGroup(pos), getHorizontalGroup(pos)],
  pos,
});

export const createCells: (blocksize: BlockSize) => Cell[] = (blocksize) =>
  pipe(
    blocksize,
    createGameRange,
    createPositions,
    map(createCell(pipe(blocksize, createGameRange))),
  );

export const isInGroup: (cell: Cell) => (group: Group) => boolean =
  (c) => (g) =>
    c.groups.includes(g);

export const filterByGroup: (cells: Cell[]) => (group: Group) => Cell[] =
  (cl) => (g) =>
    cl.filter((c) => isInGroup(c)(g));

const removeAnswerCandidateForCell: (
  cellMut: Cell,
) => (a: AnswerCandidate) => void = (cellMut) => (a) =>
  (cellMut.answerCnadidatesMut = cellMut.answerCnadidatesMut.filter(
    (v) => v !== a,
  ));

const removeAnswerCandidateForList: (
  cells: Cell[],
) => (a: AnswerCandidate) => void = (cells) => (a) =>
  cells.map(removeAnswerCandidateForCell).forEach((f) => f(a));

export const removeAnswerCandidate: (
  c: Cell | Cell[],
) => (a: AnswerCandidate) => void = (c) =>
  isArray(c)
    ? removeAnswerCandidateForList(c)
    : removeAnswerCandidateForCell(c);
