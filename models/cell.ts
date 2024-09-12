import { pipe, map } from "remeda";
import type { Group } from "./group.ts";
import { createPositions, type Position } from "./position.ts";
import { createGameRange, type BlockSize } from "./game.ts";
import { getHorizontalGroup, getVerticalGroup } from "./group.ts";

/** Internal type */
export type Cell = {
  pos: Position;
  answerMut: undefined | number;
  answerCnadidatesMut: number[];
  groups: Group[];
};

const createCell: (answerCnadidatesMut: number[]) => (pos: Position) => Cell =
  (answerCnadidatesMut) => (pos) => ({
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
