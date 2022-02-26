import GameID from '@/core/valueobject/gameId';
import { createGame } from './createGame';
import CellRepository from '@/core/repository/cellRepository';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import DeleteGameLogic from '../deleteGameLogic';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';
import Game from '@/core/entity/game';

type Params = {
  baseHeight: BaseHeight;
  baseWidth: BaseWidth;
};

export function createGoodGame({ baseHeight, baseWidth }: Params): Game {
  let createdGame: Game | undefined;

  const cellRepository = CellRepositoryImpl.create();
  const groupRepository = GroupRepositoryImpl.create();
  const gameRepository = GameRepositoryImpl.create();

  do {
    try {
      createdGame = createGame({
        baseHeight,
        baseWidth,
        cellRepository,
        groupRepository,
        gameRepository,
      });
    } catch (e) {
      //
    }
  } while (
    createdGame === undefined ||
    !isGood(createdGame.gameId, cellRepository)
  );
  return createdGame;
}

/**
 * 解答済みのセルの数が全セルの半分より少なければGOOD!
 * @param createdGameId
 */
function isGood(createdGameId: GameID, cellRepository: CellRepository) {
  const allCell = cellRepository.findAll(createdGameId);
  if (allCell.filter(cell => cell.isAnswered).length < allCell.length / 2) {
    //good
    return true;
  } else {
    //bad
    DeleteGameLogic.create().execute(createdGameId);
    return false;
  }
}
