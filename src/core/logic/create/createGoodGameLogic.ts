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
    option?: { gameTypes?: GameType[]; kiwami?: boolean },
  ): CreateGoodGameLogic {
    return new CreateGoodGameLogic(baseHeight, baseWidth, option);
  }
  constructor(
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    private option?: { gameTypes?: GameType[]; kiwami?: boolean },
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
    this.gameRepository = gameRepository;
  }
  private cellRepository: CellRepository;
  private gameRepository: GameRepository;

  public execute(): GameID {
    let createdGameId: GameID | undefined;
    let difficulty = 0;
    do {
      try {
        createdGameId = undefined;
        createdGameId = CreateGameLogic.create(
          this.baseHeight,
          this.baseWidth,
          this.option,
        ).execute();
        difficulty = this.gameRepository.find(createdGameId).difficalty.value;
      } catch (e) {
        //
      }
    } while (
      createdGameId === undefined ||
      (this.option?.kiwami && difficulty < 1)
    );
    return createdGameId;
  }
}
