import type { Cell } from "../models/cell.ts";
import {
  createGameRange,
  type BlockSize,
  type GameType,
} from "../models/game.ts";

export function assignGroupsToCells({
  blockSize,
  gameType,
  cellsMut,
}: {
  gameType: GameType;
  blockSize: BlockSize;
  cellsMut: Cell[];
}): Cell[] {
  return [];
}

function assignVerticalGroupsToCells({
  blockSize,
  cellsMut,
}: {
  blockSize: BlockSize;
  cellsMut: Cell[];
}): Cell[] {
  createGameRange(blockSize);
  return [];
}

function assignVerticalGroupsToCell({
  blockSize,
  cellMut,
}: {
  blockSize: BlockSize;
  cellMut: Cell;
}): Cell {}
