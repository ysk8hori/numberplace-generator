import type { Cell } from "../models/cell.ts";
import type { BlockSize } from "../models/game.ts";
import { range } from "remeda";
import type { Position } from "../models/position.ts";
import type { Group } from "../models/group.ts";

const createRange = (blocksize: BlockSize): number[] =>
  range(0, blocksize.height * blocksize.width);

export const createCells: (blocksize: BlockSize) => Cell[] = (
  blocksize: BlockSize,
) =>
  createRange(blocksize).flatMap((y) =>
    createRange(blocksize).map(
      (x) =>
        ({
          answer: undefined,
          answerCnadidates: createRange(blocksize),
          groups: [] satisfies Group[],
          pos: { x, y } satisfies Position,
        }) satisfies Cell,
    ),
  );
