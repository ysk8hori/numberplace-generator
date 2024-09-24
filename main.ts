import type { GameType } from './models/game.ts';
import type { Cell as InnerTypeOfCell } from './models/cell.ts';
import type { BlockSize } from './models/blockSize.ts';
import type { Position } from './models/position.ts';
import { createGameWrapper } from './functions/createGame.ts';

export type {
  /** Block size refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }. The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9. */
  BlockSize,
  /** "Standard", "Cross", "Hyper" game types */
  GameType,
  /** Position of x and y. */
  Position,
};

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

/**
 * Generate number-place (Sudoku) game.
 *
 * @param blockSize Block size refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }. The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9.
 * @returns `[pazzules, solved]`
 */
export function generateGame(
  blockSize: BlockSize,
  option?: { gameTypes?: GameType[] },
): [Game, Game] {
  console.log('generateGame');
  const result = createGameWrapper({
    blockSize,
    difficulty: 'easy',
    gameTypes: option?.gameTypes ?? ['standard'],
  });
  return [convert(result.puzzle), convert(result.solved)];
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

function convert(cells: InnerTypeOfCell[]): Game {
  return {
    cells: cells.map((c) => (
      {
        pos: c.pos,
        answer: c.answerMut === undefined ? '' : (c.answerMut + 1).toString(),
      } satisfies Cell
    )),
    toString() {
      const horizontalLines: Map<number, Cell[]> = this.cells.reduce(
        (p, cell) => {
          const lineNo = cell.pos[1];
          if (!p.has(lineNo)) p.set(lineNo, new Array<Cell>());
          p.get(lineNo)?.push(cell);
          return p;
        },
        new Map<number, Cell[]>(),
      );
      return Array.from(horizontalLines.values())
        .map((line) => line.map((cell) => cell.answer ?? ' ').join(','))
        .join('\n');
    },
  };
}

if (import.meta.main) {
  const [puzzle, solved] = generateGame({ width: 3, height: 3 });
  console.log(puzzle.toString());
  console.log(solved.toString());
}
