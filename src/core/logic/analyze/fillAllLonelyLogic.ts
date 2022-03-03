import GameID from '@/core/valueobject/gameId';
import { inject, autoInjectable } from 'tsyringe';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';

@autoInjectable()
export default class FillAllLonelyLogic {
  public static create(gameId: GameID): FillAllLonelyLogic {
    return new FillAllLonelyLogic(gameId);
  }
  constructor(
    private gameId: GameID,
    @inject('CellRepository')
    cellRepository?: CellRepository,
    @inject('GroupRepository')
    groupRepository?: GroupRepository,
    @inject('GameRepository')
    gameRepository?: GameRepository,
  ) {
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        FillAllLonelyLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.groupRepository = groupRepository;
  }
  private groupRepository: GroupRepository;

  public execute() {
    this.groupRepository
      .findAll(this.gameId)
      .forEach(group => group.fillLonely());
  }
}
