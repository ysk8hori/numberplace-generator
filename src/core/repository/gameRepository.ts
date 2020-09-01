import GameID from '@/core/valueobject/gameId';
import Game from '@/core/entity/game';

export default interface GameRepository {
  regist(game: Game): void;
  find(gameId: GameID): Game;
  remove(gameId: GameID): void;
}
