import type { Cell } from "../models/cell.ts";
import { createGameRange, type BlockSize } from "../models/game.ts";
import type { Position } from "../models/position.ts";
import type { Group } from "../models/group.ts";

export const createCells: (blocksize: BlockSize) => Cell[] = (
  blocksize: BlockSize,
) =>
  createGameRange(blocksize).flatMap((y) =>
    createGameRange(blocksize).map(
      (x) =>
        ({
          answer: undefined,
          answerCnadidates: createGameRange(blocksize),
          groups: [] satisfies Group[],
          pos: { x, y } satisfies Position,
        }) satisfies Cell,
    ),
  );
