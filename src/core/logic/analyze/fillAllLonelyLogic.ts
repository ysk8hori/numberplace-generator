import Game from '@/core/entity/game';

export function fillAllLonely(game: Game) {
  game.groupRepository
    .findAll(game.gameId)
    .forEach(group => group.fillLonely());
}
