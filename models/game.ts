import type { Cell } from "./cell.ts";

export type BlockSize = {
  width: number;
  height: number;
};
export type GameType = "standard" | "cross" | "hyper";
export type Difficulty = "easy" | "normal" | "hard";

export type Game = {
  blockSize: BlockSize;
  difficulty: Difficulty;
  gameType: GameType;
  puzzle: Cell[];
  solved: Cell[];
};
