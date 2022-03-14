import CellRepository from '@/core/repository/cellRepository';
import BusinessError from '@/core/businessError';
import GameID from '@/core/valueobject/gameId';
import { container } from 'tsyringe';

export default class FillOwnAnswerIfLastOneAnswerCandidate {
  public static create(gameId: GameID): FillOwnAnswerIfLastOneAnswerCandidate {
    return new FillOwnAnswerIfLastOneAnswerCandidate(gameId);
  }
  constructor(
    private gameId: GameID,
    cellRepository: CellRepository = container.resolve('CellRepository'),
  ) {
    if (!cellRepository)
      BusinessError.throw(
        FillOwnAnswerIfLastOneAnswerCandidate.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.cellRepository = cellRepository;
  }
  private cellRepository: CellRepository;
  public execute() {
    this.cellRepository
      .findAll(this.gameId)
      .forEach(cell => cell.fillOwnAnswerIfLastOneAnswerCandidate());
  }
}
