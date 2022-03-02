import GameID from '@/core/valueobject/gameId';
import { inject, autoInjectable } from 'tsyringe';
import CellRepository from '@/core/repository/cellRepository';
import GroupRepository from '@/core/repository/groupRepository';
import GameRepository from '@/core/repository/gameRepository';
import BusinessError from '@/core/businessError';
import { pos } from '@/core/valueobject/cellPosition';
import Answer from '@/core/valueobject/answer';

@autoInjectable()
export default class LoadLogic {
  public static create(gameId: GameID): LoadLogic {
    return new LoadLogic(gameId);
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
        LoadLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.gameRepository = gameRepository;
    this.groupRepository = groupRepository;
    this.cellRepository = cellRepository;
  }
  private groupRepository: GroupRepository;
  private gameRepository: GameRepository;
  private cellRepository: CellRepository;

  /**
   *
   * @param input ロード対象文字列
   * @param option rowSplitter:省略時は\n colSplitter:省略時は1文字ずつ。
   */
  public execute(
    input: string,
    option?: { rowSplitter?: string; colSplitter?: string },
  ) {
    const rowSplitter = option?.rowSplitter ? option.rowSplitter : '\n';
    const colSplitter = option?.colSplitter ? option.colSplitter : '';
    input.split(rowSplitter).forEach((rowString, rowIndex) => {
      rowString.trim();
      rowString.split(colSplitter).forEach((colString, colIndex) => {
        colString.trim();
        if (colString.length === 0 || colString === ' ') return;
        this.gameRepository
          .find(this.gameId)
          .fill(pos(rowIndex, colIndex), Answer.create(colString));
      });
    });
  }
}
