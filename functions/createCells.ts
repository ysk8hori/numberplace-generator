import type { Cell } from "../models/cell.ts";
import { createGameRange, type BlockSize } from "../models/game.ts";
import { getHorizontalGroup, getVerticalGroup } from "../models/group.ts";
import { createPositions, type Position } from "../models/position.ts";
import { pipe, map } from "remeda";

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
