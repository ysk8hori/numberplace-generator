import { pipe, range } from "remeda";
import type { Cell } from "./cell.ts";

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

/** BlockSize から、そのゲームの幅及び高さを求める。 */
export const calcSideLength = (blocksize: BlockSize): number =>
  blocksize.height * blocksize.width;

/** BlockSize から、そのゲームの座標や答えなどの取りうる値の集合を生成する。 */
export const createGameRange = (blocksize: BlockSize | number): number[] =>
  typeof blocksize === "number"
    ? range(0, blocksize)
    : pipe(blocksize, calcSideLength, range)(0);
