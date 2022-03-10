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
type Game = {
  cells: Cell[];
  toString: () => string;
};

/** One cell. */
type Cell = {
  /** Position of cell. */
  pos: Position;
  /** Answer filled in cell. If not filled in, undefined. */
  answer: undefined | string;
};

/** Position of x and y. */
type Position = Readonly<[number, number]>;

/**
 * Generate number-place (Sudoku) game.
 *
 * @param blockSize Block size refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }. Both must be less than or equal to 3.
 * @returns `[pazzules, corrected]`
 */
export function generateGame(blockSize: BlockSize): [Game, Game] {
  if (!validation(blockSize)) {
    throw new Error(
      'The argument must be an object of { width: number, height: number }. Both must be less than or equal to 3.',
    );
  }

  const gameId = CreateGoodGameLogic.create(
    BaseHeight.create(blockSize.height),
    BaseWidth.create(blockSize.width),
  ).execute();

  const pazzules: Game = convert(gameId);
  InfiniteAnalyzeLogic.createAndExecute(gameId);
  const corrected: Game = convert(gameId);
  cellRepository.remove(gameId);
  groupRepository.remove(gameId);
  gameRepository.remove(gameId);
  return [pazzules, corrected];

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
}

type BlockSize = {
  width: number;
  height: number;
};

function validation(blockSize: any) {
  return (
    typeof blockSize === 'object' &&
    blockSize !== null &&
    typeof blockSize?.height === 'number' &&
    typeof blockSize?.width === 'number'
  );
}
