import GameID from '@/core/valueobject/gameId';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import { GroupType } from '@/core/entity/group';
import { container } from 'tsyringe';

export default class OutputAnswerStringLogic {
  public static create(gameId: GameID): OutputAnswerStringLogic {
    return new OutputAnswerStringLogic(gameId);
  }
  constructor(
    private gameId: GameID,
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        OutputAnswerStringLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.groupRepository = groupRepository;
  }
  private groupRepository: GroupRepository;
  public getAnswerString(): string {
    return this.groupRepository
      .findByType(this.gameId, GroupType.Horizontal)
      .map(row =>
        row.cells.map(cell => cell.getAnswer()?.value ?? ' ').join('|'),
      )
      .join('\n');
  }
}
