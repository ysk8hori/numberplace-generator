import {
  pipe,
  map,
  isArray,
  isEmpty,
  isDeepEqual,
  isNonNullish,
  uniqueWith,
  unique,
  difference,
} from "remeda";
import type { Group } from "./group.ts";
import { createPositions, isSamePos, type Position } from "./position.ts";
import { createGameRange, type BlockSize } from "./game.ts";
import { getHorizontalGroup, getVerticalGroup } from "./group.ts";
import { throwError } from "../utils/utils.ts";

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

export const getEmptyCells: (cells: Cell[]) => Cell[] = (cl) =>
  cl.filter((c) => isNonNullish(c.answerMut));

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

export const fillCellAnswer: (a: Answer) => (cellMut: Cell) => void =
  (a) => (c) =>
    (c.answerMut = a);

export const findCell: (cells: Cell[]) => (p: Position) => Cell = (cl) => (p) =>
  cl.find((c) => isSamePos(c.pos, p)) ?? throwError(`該当するセルがない. ${p}`);

const 同じ答え候補をもつセルが答え候補数より多いか: (
  /** 同一グループのセル */
  cellsByGroup: Cell[],
) => (al: AnswerCandidate[]) => "多い" | "同じか少ない" = (cl) => (al) =>
  al.length < cl.filter((c) => isDeepEqual(c.answerCnadidatesMut, al)).length
    ? "多い"
    : "同じか少ない";

export const 同じ答え候補をもつセルの数が答え候補の数と同じか: (
  /** 同一グループのセル */
  cellsByGroup: Cell[],
) => (al: AnswerCandidate[]) => boolean = (cl) => (al) =>
  al.length === cl.filter((c) => isDeepEqual(c.answerCnadidatesMut, al)).length;

/** 同一グループのセルが持つ候補のリストのユニークなリストを取得する */
export const getUniqueAnswercandidatesList: (
  /** 同一グループのセル */
  cellsByGroup: Cell[],
) => AnswerCandidate[][] = (cl) =>
  uniqueWith(
    cl.map((c) => c.answerCnadidatesMut),
    isDeepEqual,
  );

const getUniqueGroups: (cells: Cell[]) => Group[] = (cl) =>
  unique(cl.flatMap((c) => c.groups));

export const 回答できないセルがあるか: (cells: Cell[]) => boolean = (cl) =>
  cl.some((c) => isNonNullish(c.answerMut) && isEmpty(c.answerCnadidatesMut));

export const refineAnswerCandidate: (cellsGroupMut: Cell[]) => void = (cl) =>
  getUniqueAnswercandidatesList(cl)
    .filter(同じ答え候補をもつセルの数が答え候補の数と同じか(cl))
    .forEach((al) =>
      cl
        .filter((c) => !isDeepEqual(al, c.answerCnadidatesMut))
        .forEach(
          (c) =>
            (c.answerCnadidatesMut = difference(c.answerCnadidatesMut, al)),
        ),
    );
