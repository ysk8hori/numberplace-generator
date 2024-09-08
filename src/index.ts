
/** Numberplace game. */
export type Game = {
  cells: Cell[];
  toString: () => string;
};

/** One cell. */
export type Cell = {
  /** Position of cell. */
  pos: Position;
  /** Answer filled in cell. If not filled in, undefined. */
  answer: undefined | string;
};

/** Position of x and y. */
export type Position = Readonly<[number, number]>;

/** Block size refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }. The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9. */
export type BlockSize = {
  width: number;
  height: number;
};

export type GameInfo = {
  difficulty: number;
};
export type GameType = 'standard' | 'cross' | 'hyper';
/**
 * Generate number-place (Sudoku) game.
 *
 * @param blockSize Block size refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }. The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9.
 * @returns `[pazzules, solved]`
 */
export function generateGame(
  blockSize: BlockSize,
  option?: {
    gameTypes?: GameType[];
    /**
     * @deprecated
     * TODO: `[InfiniteAnalyzeLogic#constructor]処理が終了しませんでした。` を解決する
     */
    kiwami?: boolean;
  },
): [Game, Game, GameInfo] {
  console.log('generateGame');
  return [
    {
      cells: [],
      toString: () => '',
    },
    {
      cells: [],
      toString: () => '',
    },
    {
      difficulty: 0,
    },
  ];
}

export type AnalyzeParams = {
  blockSize: BlockSize;
  puzzle: Game;
  option?: { gameTypes?: GameType[] };
};
export type AnalyzeStatus = 'solved' | 'invalid_puzzle' | 'multiple_answers';
export type AnalyzeResult<T extends 'invalid_puzzle' | 'multiple_answers'> = {
  status: T;
};
export type SolvedAnalyzeResult = {
  status: 'solved';
  solved: Game;
};
export function analyzeGame({
  blockSize,
  puzzle,
  option,
}: AnalyzeParams):
  | SolvedAnalyzeResult
  | AnalyzeResult<'invalid_puzzle'>
  | AnalyzeResult<'multiple_answers'> {
    console.log('analyzeGame');
    return {
      status: 'solved',
      solved: {
        cells: [],
        toString: () => '',
      },
    };
}
