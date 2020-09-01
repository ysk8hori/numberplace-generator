import GameRepository from '@/core/repository/gameRepository';
import GameID from '@/core/valueobject/gameId';
import Game from '@/core/entity/game';
import BusinessError from '@/core/businessError';

export default class GameRepositoryImpl implements GameRepository {
  public static create(): GameRepository {
    return new GameRepositoryImpl();
  }
  public static games: Game[] = [];
  public regist(game: Game): void {
    GameRepositoryImpl.games.push(game);
  }
  public find(gameId: GameID): Game {
    return (
      GameRepositoryImpl.games.find(game => game.gameId.equals(gameId)) ??
      BusinessError.throw(
        GameRepositoryImpl.name,
        this.find.name,
        '指定したGameは見つかりません。'
      )
    );
  }
  public remove(gameId: GameID): void {
    GameRepositoryImpl.games = GameRepositoryImpl.games.filter(
      game => !game.gameId.equals(gameId)
    );
  }
}
