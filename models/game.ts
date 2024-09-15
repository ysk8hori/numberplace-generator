import type { Cell } from './cell.ts';
import type { BlockSize } from './blockSize.ts';

/** Internal type */
export type GameType = 'standard' | 'cross' | 'hyper' | 'hypercross';
/** Internal type */
export type Difficulty = 'easy' | 'normal' | 'hard';

/** Internal type */
export type GameInfo = {
  blockSize: BlockSize;
  difficulty: Difficulty;
  gameType: GameType;
};

/** Internal type */
export type Game = GameInfo & {
  puzzle: Cell[];
  solved: Cell[];
};
