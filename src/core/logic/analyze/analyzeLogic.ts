import GameID from '../../valueobject/gameId';
import { autoInjectable, inject } from 'tsyringe';
import CellRepository from '../../repository/cellRepository';
import GroupRepository from '../../repository/groupRepository';
import GameRepository from '../../repository/gameRepository';
import BusinessError from '../../businessError';
import FillAllLonelyLogic from './fillAllLonelyLogic';
import FillOwnAnswerIfLastOneAnswerCandidate from './fillOwnAnswerIfLastOneAnswerCandidateLogic';
import OutputAnswerStringLogic from '../outputAnswerStringLogic';

@autoInjectable()
export default class AnalyzeLogic {
  public static create(gameId: GameID): AnalyzeLogic {
    return new AnalyzeLogic(gameId);
  }
  constructor(
    private gameId: GameID,
    @inject('CellRepository')
    cellRepository?: CellRepository,
    @inject('GroupRepository')
    groupRepository?: GroupRepository,
    @inject('GameRepository')
    gameRepository?: GameRepository
  ) {
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        AnalyzeLogic.name,
        'constructor',
        'リポジトリが指定されていません。'
      );
    this.cellRepository = cellRepository;
  }
  private cellRepository: CellRepository;

  /**
   * ゲーム全体を解析し答えを記入する
   * @returns 解析で答えが確定しなかったセルの数
   */
  public execute(): number {
    const remainingCount = this.doFill();
    this.outputAnswerString();
    return this.getRemainingCount();
  }

  private doFill() {
    let remainingCount: number;
    do {
      remainingCount = this.getRemainingCount();
      FillAllLonelyLogic.create(this.gameId).execute();
      FillOwnAnswerIfLastOneAnswerCandidate.create(this.gameId).execute();
    } while (remainingCount !== this.getRemainingCount());
    return remainingCount;
  }

  private getRemainingCount(): number {
    let count: number = 0;
    this.cellRepository.findAll(this.gameId).forEach(cell => {
      if (cell.isAnswered) count++;
    });
    return this.cellRepository.findAll(this.gameId).length - count;
  }

  private outputAnswerString() {
    // const outputAnswerStringLogic = OutputAnswerStringLogic.create(this.gameId);
    // console.log(outputAnswerStringLogic.getAnswerString());
  }
}
