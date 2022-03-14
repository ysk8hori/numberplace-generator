import GameID from '../valueobject/gameId';
import CellRepository from '../repository/cellRepository';
import GroupRepository from '../repository/groupRepository';
import GameRepository from '../repository/gameRepository';
import BusinessError from '../businessError';
import { container } from 'tsyringe';

export default class DeleteGameLogic {
  public static create(): DeleteGameLogic {
    return new DeleteGameLogic();
  }
  constructor(
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    if (!cellRepository || !groupRepository || !gameRepository) {
      BusinessError.throw(
        DeleteGameLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    }
    this.cellRepository = cellRepository;
    this.groupRepository = groupRepository;
    this.gameRepository = gameRepository;
  }
  private cellRepository: CellRepository;
  private groupRepository: GroupRepository;
  private gameRepository: GameRepository;
  public execute(gameId: GameID) {
    this.cellRepository.remove(gameId);
    this.groupRepository.remove(gameId);
    this.gameRepository.remove(gameId);
  }
}
