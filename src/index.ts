/** ナンプレ問題を解く機能と作成する機能をシンプルに提供する */

import 'reflect-metadata';
import { container } from 'tsyringe';
import CellRepository from '@/core/repository/cellRepository';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GroupRepository from '@/core/repository/groupRepository';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import GameRepository from '@/core/repository/gameRepository';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';
import CreateGoodGameLogic from './core/logic/create/createGoodGameLogic';
import InfiniteAnalyzeLogic from './core/logic/analyze/infiniteAnalyze/infiniteAnalyzeLogic';
import BaseHeight from './core/valueobject/baseHeight';
import BaseWidth from './core/valueobject/baseWidth';
import GameID from './core/valueobject/gameId';
import { GameType } from './core/types';
import GeneratorsGame from './core/entity/game';
import { pos } from './core/valueobject/cellPosition';
import Answer from './core/valueobject/answer';
export { GameType } from './core/types';

const cellRepository = CellRepositoryImpl.create();
const groupRepository = GroupRepositoryImpl.create();
const gameRepository = GameRepositoryImpl.create();

container.register<CellRepository>('CellRepository', {
  useValue: cellRepository,
});
container.register<GroupRepository>('GroupRepository', {
  useValue: groupRepository,
});
container.register<GameRepository>('GameRepository', {
  useValue: gameRepository,
});

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
  if (!validation(blockSize)) {
    throw new Error(
      'The argument must be an object of { width: number, height: number }. The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9.',
    );
  }

  const gameId = CreateGoodGameLogic.create(
    BaseHeight.create(blockSize.height),
    BaseWidth.create(blockSize.width),
    option,
  ).execute();

  const pazzules: Game = convert(gameId);
  InfiniteAnalyzeLogic.createAndExecute(gameId);
  const solved: Game = convert(gameId);
  const gameInfo: GameInfo = {
    difficulty: gameRepository.find(gameId).difficalty.value,
  };
  cellRepository.remove(gameId);
  groupRepository.remove(gameId);
  gameRepository.remove(gameId);
  return [pazzules, solved, gameInfo];
}

function convert(gameId: GameID): Game {
  return {
    cells: cellRepository.findAll(gameId).map(cell => ({
      pos: [
        cell.position.horizontalPosition.value,
        cell.position.verticalPosition.value,
      ],
      answer: cell.answer?.value,
    })),
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
        .map(line => line.map(cell => cell.answer ?? ' ').join(','))
        .join('\n');
    },
  };
}

function validation(blockSize: BlockSize) {
  return (
    typeof blockSize === 'object' &&
    blockSize !== null &&
    typeof blockSize?.height === 'number' &&
    typeof blockSize?.width === 'number' &&
    blockSize.height * blockSize.width <= 16 &&
    blockSize.height * blockSize.width >= 3
  );
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
  let game: GeneratorsGame;
  let fliped: GeneratorsGame;
  try {
    game = GeneratorsGame.create(
      BaseHeight.create(blockSize.height),
      BaseWidth.create(blockSize.width),
      option?.gameTypes,
    );
    // 不正な問題の場合は game.fill でエラーとなる場合があるので try catch が必要
    puzzle.cells
      .filter(cell => cell.answer)
      .forEach(cell =>
        game.fill(pos(cell.pos[1], cell.pos[0]), Answer.create(cell.answer!)),
      );
    fliped = game.fliped();
    InfiniteAnalyzeLogic.createAndExecute(game.gameId);
    InfiniteAnalyzeLogic.createAndExecute(fliped.gameId);
  } catch (e) {
    return { status: 'invalid_puzzle' };
  }
  const cells = cellRepository.findAll(game.gameId);
  const flipedCells = cellRepository.findAll(fliped.fliped().gameId);
  if (!cells.every((cell, i) => cell.answer?.equals(flipedCells[i]?.answer))) {
    return { status: 'multiple_answers' };
  }

  return { status: 'solved', solved: convert(game.gameId) };
}
