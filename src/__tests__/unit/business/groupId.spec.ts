import GroupID from '@/core/valueobject/groupId';
import GameID from '@/core/valueobject/gameId';

describe('GroupID', () => {
  const gameA = GameID.create();
  it('isSameGroupIDs', () => {
    expect(GroupID.create(gameA, 'v0')).toEqual(GroupID.create(gameA, 'v0'));
  });
});
