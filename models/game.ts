import type { Cell } from "./cell.ts";
import type { BlockSize } from "./blockSize.ts";

/** Internal type */
export type GameType = "standard" | "cross" | "hyper";
/** Internal type */
export type Difficulty = "easy" | "normal" | "hard";

/** Internal type */
export type Game = {
  blockSize: BlockSize;
  difficulty: Difficulty;
  gameType: GameType;
  puzzle: Cell[];
  solved: Cell[];
};
