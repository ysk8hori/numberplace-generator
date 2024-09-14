import type { GameType } from "./models/game.ts";
import type { BlockSize } from "./models/blockSize.ts";
import type { Position } from "./models/position.ts";

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
  console.log("generateGame");
  const puzzle = JSON.parse(
    '{"cells":[{"pos":[0,0]},{"pos":[1,0],"answer":"5"},{"pos":[2,0]},{"pos":[3,0]},{"pos":[4,0]},{"pos":[5,0]},{"pos":[6,0]},{"pos":[7,0]},{"pos":[8,0]},{"pos":[0,1],"answer":"1"},{"pos":[1,1]},{"pos":[2,1],"answer":"2"},{"pos":[3,1]},{"pos":[4,1],"answer":"8"},{"pos":[5,1]},{"pos":[6,1]},{"pos":[7,1]},{"pos":[8,1]},{"pos":[0,2],"answer":"8"},{"pos":[1,2]},{"pos":[2,2]},{"pos":[3,2],"answer":"2"},{"pos":[4,2]},{"pos":[5,2],"answer":"9"},{"pos":[6,2]},{"pos":[7,2],"answer":"3"},{"pos":[8,2]},{"pos":[0,3],"answer":"9"},{"pos":[1,3]},{"pos":[2,3],"answer":"4"},{"pos":[3,3],"answer":"8"},{"pos":[4,3]},{"pos":[5,3]},{"pos":[6,3]},{"pos":[7,3]},{"pos":[8,3],"answer":"1"},{"pos":[0,4]},{"pos":[1,4]},{"pos":[2,4]},{"pos":[3,4]},{"pos":[4,4]},{"pos":[5,4]},{"pos":[6,4],"answer":"6"},{"pos":[7,4],"answer":"4"},{"pos":[8,4]},{"pos":[0,5]},{"pos":[1,5],"answer":"3"},{"pos":[2,5]},{"pos":[3,5]},{"pos":[4,5]},{"pos":[5,5],"answer":"7"},{"pos":[6,5],"answer":"9"},{"pos":[7,5]},{"pos":[8,5]},{"pos":[0,6]},{"pos":[1,6],"answer":"7"},{"pos":[2,6]},{"pos":[3,6]},{"pos":[4,6]},{"pos":[5,6],"answer":"4"},{"pos":[6,6],"answer":"3"},{"pos":[7,6]},{"pos":[8,6]},{"pos":[0,7]},{"pos":[1,7],"answer":"8"},{"pos":[2,7]},{"pos":[3,7],"answer":"7"},{"pos":[4,7]},{"pos":[5,7]},{"pos":[6,7]},{"pos":[7,7]},{"pos":[8,7]},{"pos":[0,8]},{"pos":[1,8],"answer":"1"},{"pos":[2,8]},{"pos":[3,8]},{"pos":[4,8],"answer":"3"},{"pos":[5,8]},{"pos":[6,8]},{"pos":[7,8]},{"pos":[8,8],"answer":"9"}]}',
  );
  const solved = JSON.parse(
    '{"cells":[{"pos":[0,0],"answer":"3"},{"pos":[1,0],"answer":"5"},{"pos":[2,0],"answer":"7"},{"pos":[3,0],"answer":"1"},{"pos":[4,0],"answer":"4"},{"pos":[5,0],"answer":"6"},{"pos":[6,0],"answer":"8"},{"pos":[7,0],"answer":"9"},{"pos":[8,0],"answer":"2"},{"pos":[0,1],"answer":"1"},{"pos":[1,1],"answer":"9"},{"pos":[2,1],"answer":"2"},{"pos":[3,1],"answer":"3"},{"pos":[4,1],"answer":"8"},{"pos":[5,1],"answer":"5"},{"pos":[6,1],"answer":"4"},{"pos":[7,1],"answer":"6"},{"pos":[8,1],"answer":"7"},{"pos":[0,2],"answer":"8"},{"pos":[1,2],"answer":"4"},{"pos":[2,2],"answer":"6"},{"pos":[3,2],"answer":"2"},{"pos":[4,2],"answer":"7"},{"pos":[5,2],"answer":"9"},{"pos":[6,2],"answer":"1"},{"pos":[7,2],"answer":"3"},{"pos":[8,2],"answer":"5"},{"pos":[0,3],"answer":"9"},{"pos":[1,3],"answer":"6"},{"pos":[2,3],"answer":"4"},{"pos":[3,3],"answer":"8"},{"pos":[4,3],"answer":"2"},{"pos":[5,3],"answer":"3"},{"pos":[6,3],"answer":"7"},{"pos":[7,3],"answer":"5"},{"pos":[8,3],"answer":"1"},{"pos":[0,4],"answer":"7"},{"pos":[1,4],"answer":"2"},{"pos":[2,4],"answer":"8"},{"pos":[3,4],"answer":"9"},{"pos":[4,4],"answer":"5"},{"pos":[5,4],"answer":"1"},{"pos":[6,4],"answer":"6"},{"pos":[7,4],"answer":"4"},{"pos":[8,4],"answer":"3"},{"pos":[0,5],"answer":"5"},{"pos":[1,5],"answer":"3"},{"pos":[2,5],"answer":"1"},{"pos":[3,5],"answer":"4"},{"pos":[4,5],"answer":"6"},{"pos":[5,5],"answer":"7"},{"pos":[6,5],"answer":"9"},{"pos":[7,5],"answer":"2"},{"pos":[8,5],"answer":"8"},{"pos":[0,6],"answer":"2"},{"pos":[1,6],"answer":"7"},{"pos":[2,6],"answer":"9"},{"pos":[3,6],"answer":"5"},{"pos":[4,6],"answer":"1"},{"pos":[5,6],"answer":"4"},{"pos":[6,6],"answer":"3"},{"pos":[7,6],"answer":"8"},{"pos":[8,6],"answer":"6"},{"pos":[0,7],"answer":"6"},{"pos":[1,7],"answer":"8"},{"pos":[2,7],"answer":"3"},{"pos":[3,7],"answer":"7"},{"pos":[4,7],"answer":"9"},{"pos":[5,7],"answer":"2"},{"pos":[6,7],"answer":"5"},{"pos":[7,7],"answer":"1"},{"pos":[8,7],"answer":"4"},{"pos":[0,8],"answer":"4"},{"pos":[1,8],"answer":"1"},{"pos":[2,8],"answer":"5"},{"pos":[3,8],"answer":"6"},{"pos":[4,8],"answer":"3"},{"pos":[5,8],"answer":"8"},{"pos":[6,8],"answer":"2"},{"pos":[7,8],"answer":"7"},{"pos":[8,8],"answer":"9"}]}',
  );
  return [convert(puzzle), convert(solved)];
}

export type AnalyzeParams = {
  blockSize: BlockSize;
  puzzle: Game;
  option?: { gameTypes?: GameType[] };
};
export type AnalyzeStatus = "solved" | "invalid_puzzle" | "multiple_answers";
export type AnalyzeResult<T extends "invalid_puzzle" | "multiple_answers"> = {
  status: T;
};
export type SolvedAnalyzeResult = {
  status: "solved";
  solved: Game;
};
export function analyzeGame({
  blockSize,
  puzzle,
  option,
}: AnalyzeParams):
  | SolvedAnalyzeResult
  | AnalyzeResult<"invalid_puzzle">
  | AnalyzeResult<"multiple_answers"> {
  console.log("analyzeGame");
  return {
    status: "solved",
    solved: {
      cells: [],
      toString: () => "",
    },
  };
}

function convert(game: Game): Game {
  return {
    cells: game.cells,
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
        .map((line) => line.map((cell) => cell.answer ?? " ").join(","))
        .join("\n");
    },
  };
}

if (import.meta.main) {
  const [puzzle, solved] = generateGame({ width: 3, height: 3 });
  console.log(puzzle.toString());
  console.log(solved.toString());
}
