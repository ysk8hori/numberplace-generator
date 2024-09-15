import {
  difference,
  isDeepEqual,
  isEmpty,
  isNonNullish,
  isNullish,
  map,
  pipe,
  piped,
  tap,
  unique,
  uniqueWith,
  zip,
} from 'remeda';
import type { Group } from './group.ts';
import { createPositions, isSamePos, type Position } from './position.ts';
import { type BlockSize, createGameRange } from './blockSize.ts';
import {
  getBlockGroup,
  getHorizontalGroup,
  getVerticalGroup,
} from './group.ts';
import { branch, throwError } from '../utils/utils.ts';
import { filter } from 'remeda';
import { isStrictEqual } from 'remeda';

export type Answer = number;
export type AnswerCandidate = number;

/** Internal type */
export type Cell = {
  pos: Position;
  answerMut: undefined | Answer;
  answerCnadidatesMut: AnswerCandidate[];
  groups: Group[];
};

export const createCells: (blocksize: BlockSize) => Cell[] = (blocksize) =>
  pipe(
    blocksize,
    createGameRange,
    createPositions,
    map(
      (pos) => ({
        answerMut: undefined,
        answerCnadidatesMut: createGameRange(blocksize),
        groups: [
          getVerticalGroup(pos),
          getHorizontalGroup(pos),
          getBlockGroup(blocksize)(pos),
        ],
        pos,
      } satisfies Cell),
    ),
  );

export const isCellsPosition: (p: Position) => (c: Cell) => boolean =
  (p) => (c) => isSamePos(c.pos, p);

export const isInGroup: (cell: Cell) => (group: Group) => boolean =
  (c) => (g) => c.groups.includes(g);

export const filterByGroup: (cells: Cell[]) => (group: Group) => Cell[] =
  (cl) => (g) => cl.filter((c) => isInGroup(c)(g));

export const getEmptyCells: (cells: Cell[]) => Cell[] = (cl) =>
  cl.filter((c) => isNonNullish(c.answerMut));

export const getByPosition: (cells: Cell[]) => (p: Position) => Cell = (cl) =>
(
  p,
) => cl.find(isCellsPosition(p)) ?? throwError(`該当するセルがない. ${p}`);

/** 指定したセルから指定した候補値を削除する。削除した場合は true を返し、削除対象がなかった場合は false を返す。*/
const removeAnswerCandidateForCell: (
  c: Cell,
) => (a: AnswerCandidate) => boolean = (cellMut) => (a) => {
  const oldAnswerCandidateList = cellMut.answerCnadidatesMut;
  cellMut.answerCnadidatesMut = cellMut.answerCnadidatesMut.filter(
    (v) => v !== a,
  );
  return oldAnswerCandidateList.length !== cellMut.answerCnadidatesMut.length;
};

/**
指定したセル全てから指定した候補値を削除する。候補値を削除したセルのリストを返却する。
削除対象としたセルのリストを返却する理由は、本関数によって変更が生じたか否かを確かめるのに使用するため。
*/
export const removeAnswerCandidate: (
  c: Cell[],
) => (a: AnswerCandidate) => Cell[] = (cells) => (a) =>
  pipe(
    cells,
    map(removeAnswerCandidateForCell),
    map((f) => f(a)),
    zip(cells),
    filter(([b, _]) => b),
    map(([_, c]) => c),
  );

/**
セルに答えを入力する。
副作用として、答えの候補値のリストも入力した答えのみを持つ状態にする。
*/
export const fillCellAnswer: (a: Answer) => (cellMut: Cell) => void = (a) =>
  piped(
    tap((c) => (c.answerMut = a)),
    tap((c) => (c.answerCnadidatesMut = [a])),
  );

export const findCell: (cells: Cell[]) => (p: Position) => Cell = (cl) => (p) =>
  cl.find((c) => isSamePos(c.pos, p)) ?? throwError(`該当するセルがない. ${p}`);

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

export const セルが回答済みか: (cell: Cell) => boolean = (c) =>
  isNonNullish(c.answerMut);
export const セルが未回答か: (cell: Cell) => boolean = (c) =>
  isNullish(c.answerMut);
export const 未回答のセルを抽出する: (cells: Cell[]) => Cell[] = (cl) =>
  cl.filter(セルが未回答か);
/**
指定されたセル全部に対し、回答できる状態であることを確認する。
答えが記入されていないのに候補が空であるセルは回答できない不正な状態になっているとみなせる。
*/
export const 全てのセルが回答可能か: (cells: Cell[]) => boolean = (cl) =>
  !cl
    .filter((c) => isNullish(c.answerMut))
    .some((c) => isEmpty(c.answerCnadidatesMut));

export const 全てのセルが回答済みか: (cells: Cell[]) => boolean = (cl) =>
  cl.filter((c) => isNullish(c.answerMut)).length === 0;

/**
したものを利用する場合は refineAnswerCandidateRecursive を使うべき。

候補値の最適化を行う。指定した複数のセルの候補値を、できる限り絞り込む。

指定した複数のセルの候補値についてそれぞれグループに分け、同一グループに属するセルに以下を行う。

- 同じ候補値のリストを持つセルの数がその候補値のリスト長と同じ場合は、それらを持つセル達のみにそれらの候補値が当てはまるはずであるため、他のセルからそれらの候補値を削除する。
*/
const refineAnswerCandidate: (cellsGroupMut: Cell[]) => void = (cl) =>
  pipe(
    cl,
    getUniqueGroups,
    map(filterByGroup(cl)),
    map((cl) =>
      getUniqueAnswercandidatesList(cl)
        .filter(同じ答え候補をもつセルの数が答え候補の数と同じか(cl))
        .forEach((al) =>
          cl
            .filter((c) => !isDeepEqual(al, c.answerCnadidatesMut))
            .forEach(
              (
                c,
              ) => (c.answerCnadidatesMut = difference(
                c.answerCnadidatesMut,
                al,
              )),
            )
        )
    ),
  );

/**
候補値の最適化を行う。指定した複数のセルの候補値を、できる限り絞り込む。

指定した複数のセルの候補値についてそれぞれグループに分け、同一グループに属するセルに以下を行う。

- 同じ候補値のリストを持つセルの数がその候補値のリスト長と同じ場合は、それらを持つセル達のみにそれらの候補値が当てはまるはずであるため、他のセルからそれらの候補値を削除する。
*/
export const refineAnswerCandidateRecursive: (cellsGroupMut: Cell[]) => void = (
  cl,
) =>
  branch(
      (cl: Cell[]) => JSON.stringify(cl.map((cl) => cl.answerCnadidatesMut)),
      piped(tap(refineAnswerCandidate), (cl) =>
        JSON.stringify(cl.map((cl) => cl.answerCnadidatesMut))),
      isStrictEqual,
    )(cl)
    ? undefined
    : refineAnswerCandidateRecursive(cl);

export function cellToString(cells: Cell[]): string {
  const horizontalLines: Map<number, Cell[]> = cells.reduce(
    (p, cell) => {
      const lineNo = cell.pos[1];
      if (!p.has(lineNo)) p.set(lineNo, new Array<Cell>());
      p.get(lineNo)?.push(cell);
      return p;
    },
    new Map<number, Cell[]>(),
  );
  return Array.from(horizontalLines.values())
    .map((line) => line.map((cell) => cell.answerMut ?? ' ').join(','))
    .join('\n');
}
