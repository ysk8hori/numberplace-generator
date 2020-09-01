import GameIdRepository from '@/application/repository/gameIdRepository';
import GameID from '@/core/valueobject/gameId';

export default class GameIdRepositoryImpl implements GameIdRepository {
  public static create(): GameIdRepository {
    return new GameIdRepositoryImpl();
  }
  private constructor() {}
  private currentGameId?: GameID;
  public setCurrentGameId(gameId: GameID | undefined) {
    this.currentGameId = gameId;
  }
  public getCurrentGameId(): GameID | undefined {
    return this.currentGameId;
  }
}
