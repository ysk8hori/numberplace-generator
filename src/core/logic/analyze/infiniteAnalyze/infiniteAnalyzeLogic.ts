import GameID from '../../../valueobject/gameId';
import CellRepository from '../../../repository/cellRepository';
import GroupRepository from '../../../repository/groupRepository';
import GameRepository from '../../../repository/gameRepository';
import BusinessError from '../../../businessError';
import TentativeAnalyzer from './tentativeAnalyzer';
import Game from '@/core/entity/game';
import Difficalty from '@/core/valueobject/difficalty';
import DeleteGameLogic from '../../deleteGameLogic';
import { container } from 'tsyringe';

export default class InfiniteAnalyzeLogic {
  public static createAndExecute(gameId: GameID, isCreate = false) {
    // console.log('InfiniteAnalyzeLogic start');
    new InfiniteAnalyzeLogic(gameId, isCreate).execute();
    // console.log('InfiniteAnalyzeLogic end');
  }
  constructor(
    private gameId: GameID,
    private isCreate: boolean,
    cellRepository: CellRepository = container.resolve('CellRepository'),
    groupRepository: GroupRepository = container.resolve('GroupRepository'),
    gameRepository: GameRepository = container.resolve('GameRepository'),
  ) {
    TentativeAnalyzer.count = 0;
    if (!cellRepository || !groupRepository || !gameRepository)
      BusinessError.throw(
        InfiniteAnalyzeLogic.name,
        'constructor',
        'リポジトリが指定されていません。',
      );
    this.cellRepository = cellRepository;
    this.gameRepository = gameRepository;
    this.game = gameRepository.find(this.gameId);
  }
  private cellRepository: CellRepository;
  private gameRepository: GameRepository;
  private game: Game;
  private deleteGameLogic = DeleteGameLogic.create();

  public execute() {
    // 難易度を初期化
    this.game.setDifficalty(Difficalty.create());
    const tentativeAnalyzer = TentativeAnalyzer.create(
      this.gameId,
      this.isCreate,
    );
    tentativeAnalyzer.execute();
    if (tentativeAnalyzer.successGameId) {
      this.gameRepository
        .find(this.gameId)
        .setDifficalty(
          this.gameRepository.find(tentativeAnalyzer.successGameId).difficalty,
        );
      this.cellRepository
        .findAll(tentativeAnalyzer.successGameId)
        .forEach(analyzedCell => {
          const cell = this.cellRepository.findByPosition(
            this.gameId,
            analyzedCell.position,
          );
          if (cell.isAnswered) return;
          this.game.fill(cell.position, analyzedCell.answer!);
        });
      // 解析用ゲームを解放
      this.deleteGameLogic.execute(tentativeAnalyzer.successGameId);
    } else {
      BusinessError.throw(
        InfiniteAnalyzeLogic.name,
        this.execute.name,
        '解析できません！',
      );
    }
  }
}
