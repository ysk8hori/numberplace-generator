import { container } from 'tsyringe';
import GameID from '@/core/valueobject/gameId';
import CreateGameLogic from './createGameLogic';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import { GameType } from '@/core/types';

export default class CreateGoodGameLogic {
  public static create(
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
    option?: { gameTypes?: GameType[] },
  ): CreateGoodGameLogic {
    return new CreateGoodGameLogic(baseHeight, baseWidth, option);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    private option?: { gameTypes?: GameType[] },
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
          this.option,
        ).execute();
        // console.log(`this is Good? :${this.isGood(createdGameId, false)}`);
      } catch (e) {
        //
      }
    } while (createdGameId === undefined);
    return createdGameId;
  }
}
