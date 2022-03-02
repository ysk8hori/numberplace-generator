import CellRepository from '../../../repository/cellRepository';
import GroupRepository from '../../../repository/groupRepository';
import GameRepository from '../../../repository/gameRepository';
import BusinessError from '../../../businessError';
import TentativeAnalyzer, { tentativeAnalyze } from './tentativeAnalyzer';
import Game from '@/core/entity/game';
import Difficalty from '@/core/valueobject/difficalty';
import DeleteGameLogic from '../../deleteGameLogic';

type Params = {
  game: Game;
  cellRepository: CellRepository;
  groupRepository: GroupRepository;
  gameRepository: GameRepository;
  isCreate?: boolean;
};

export function infiniteAnalyze({
  game,
  cellRepository,
  groupRepository,
  gameRepository,
  isCreate = false,
}: Params) {
  TentativeAnalyzer.count = 0;
  const deleteGameLogic = DeleteGameLogic.create();

  // 難易度を初期化
  game.setDifficalty(Difficalty.create());
  // const tentativeAnalyzer = TentativeAnalyzer.create(game.gameId, isCreate);
  // tentativeAnalyzer.execute();
  const successGameId = tentativeAnalyze({
    isCreate,
    parrentGame: game,
    cellRepository,
  });

  if (successGameId) {
    gameRepository
      .find(game.gameId)
      .setDifficalty(gameRepository.find(successGameId).difficalty);
    cellRepository.findAll(successGameId).forEach(analyzedCell => {
      const cell = cellRepository.findByPosition(
        game.gameId,
        analyzedCell.position,
      );
      if (cell.isAnswered) return;
      game.fill(cell.position, analyzedCell.answer!);
    });
    // 解析用ゲームを解放
    deleteGameLogic.execute(successGameId);
  } else {
    BusinessError.throw('', 'infiniteAnalyze', '解析できません！');
  }
}
