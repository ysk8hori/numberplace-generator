import { Cell } from "./cell.ts";

/** Internal type */
export type BlockSize = {
  width: number;
  height: number;
};
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
