import { container } from 'tsyringe';
import GameID from '@/core/valueobject/gameId';
import CreateGameLogic from './createGameLogic';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import DeleteGameLogic from '../deleteGameLogic';

export default class CreateGoodGameLogic {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
  ): CreateGoodGameLogic {
    return new CreateGoodGameLogic(baseHeight, baseWidth);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        CreateGameLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.cellRepository = cellRepository;
  }
  private cellRepository: CellRepository;

  public execute(): GameID {
    let createdGameId: GameID | undefined;
    do {
      try {
        createdGameId = undefined;
        createdGameId = CreateGameLogic.create(
          this.baseHeight,
          this.baseWidth,
        ).execute();
        // console.log(`this is Good? :${this.isGood(createdGameId, false)}`);
      } catch (e) {
        //
      }
    } while (createdGameId === undefined || !this.isGood(createdGameId));
    return createdGameId;
  }

  /**
   * 解答済みのセルの数が全セルの半分より少なければGOOD!
   * @param createdGameId
   */
  private isGood(createdGameId: GameID, remove = true) {
    const allCell = this.cellRepository.findAll(createdGameId);
    if (allCell.filter(cell => cell.isAnswered).length < allCell.length / 2) {
      //good
      return true;
    } else {
      //bad
      if (remove) DeleteGameLogic.create().execute(createdGameId);
      return false;
    }
  }
}
