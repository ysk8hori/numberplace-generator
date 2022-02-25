import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GroupID from '@/core/valueobject/groupId';
import CellPosition from '@/core/valueobject/cellPosition';

describe('game.ts', () => {
  describe('ゲームを生成し、各グループに6つずつCellが設定されていることをチェックする', () => {
    const game = Game.create(BaseHeight.create(2), BaseWidth.create(3));
    const cellRepository = CellRepositoryImpl.create();
    it('v0にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v0')
        ).length
      ).toBe(6);
    });
    it('v1にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v1')
        ).length
      ).toBe(6);
    });
    it('v2にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v2')
        ).length
      ).toBe(6);
    });
    it('v3にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v3')
        ).length
      ).toBe(6);
    });
    it('v4にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v4')
        ).length
      ).toBe(6);
    });
    it('v5にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'v5')
        ).length
      ).toBe(6);
    });
    it('h0にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h0')
        ).length
      ).toBe(6);
    });
    it('h1にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h1')
        ).length
      ).toBe(6);
    });
    it('h2にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h2')
        ).length
      ).toBe(6);
    });
    it('h3にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h3')
        ).length
      ).toBe(6);
    });
    it('h4にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h4')
        ).length
      ).toBe(6);
    });
    it('h5にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 'h5')
        ).length
      ).toBe(6);
    });
    it('s0にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's0')
        ).length
      ).toBe(6);
    });
    it('s1にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's1')
        ).length
      ).toBe(6);
    });
    it('s2にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's2')
        ).length
      ).toBe(6);
    });
    it('s3にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's3')
        ).length
      ).toBe(6);
    });
    it('s4にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's4')
        ).length
      ).toBe(6);
    });
    it('s5にCellが6個設定されていること', () => {
      expect(
        cellRepository.findByGroup(
          game.gameId,
          GroupID.create(game.gameId, 's5')
        ).length
      ).toBe(6);
    });
    it('0,0 が v0,h0,s0に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's0'),
      ]);
    });
    it('1,0 が v1,h0,s0に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(1, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v1'),
        GroupID.create(game.gameId, 's0'),
      ]);
    });
    it('2, 0 が h0,v2,s0に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(2, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v2'),
        GroupID.create(game.gameId, 's0'),
      ]);
    });
    it('3, 0 が h0,v3,s1に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(3, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v3'),
        GroupID.create(game.gameId, 's1'),
      ]);
    });
    it('4, 0 が h0,v4,s1に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(4, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v4'),
        GroupID.create(game.gameId, 's1'),
      ]);
    });
    it('5, 0 が h0,v5,s1に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(5, 0)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h0'),
        GroupID.create(game.gameId, 'v5'),
        GroupID.create(game.gameId, 's1'),
      ]);
    });
    it('0, 1 が h1,v0,s0に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 1)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h1'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's0'),
      ]);
    });
    it('0, 2 が h2,v0,s2に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 2)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h2'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's2'),
      ]);
    });
    it('0, 3 が h3,v0,s2に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 3)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h3'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's2'),
      ]);
    });
    it('0, 4 が h4,v0,s4に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 4)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h4'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's4'),
      ]);
    });
    it('0, 5 が h5,v0,s4に属していること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 5)
        ).groupIds
      ).toEqual([
        GroupID.create(game.gameId, 'h5'),
        GroupID.create(game.gameId, 'v0'),
        GroupID.create(game.gameId, 's4'),
      ]);
    });
  });
});
