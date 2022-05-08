import GroupFactory from '@/core/factory/groupFactory';
import CellFactory from '@/core/factory/cellFactory';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import GameID from '@/core/valueobject/gameId';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import { GroupType } from '@/core/entity/group';
import { describe, it, expect } from 'vitest';

describe('hyperグループの生成', () => {
  describe('9x9 以外のサイズの場合', () => {
    it('9x9 以外のサイズでは hyper グループを作成できない', () => {
      const baseHeight = BaseHeight.create(2);
      const baseWidth = BaseWidth.create(3);
      const gameId = GameID.create();
      const answerCandidateCollection = AnswerCandidateCollection.create(
        baseHeight,
        baseWidth,
      );
      CellFactory.create(
        gameId,
        baseHeight,
        baseWidth,
        answerCandidateCollection,
      ).createCells();
      const groupFactory: GroupFactory = GroupFactory.create(
        gameId,
        baseHeight,
        baseWidth,
      );
      expect(() => groupFactory.createHyperGroup()).toThrowError(
        /hyper は baseWidth:3 baseHeight:3 の問題以外では作成できません/,
      );
    });
  });
  describe('9x9 のサイズの場合', () => {
    const baseHeight = BaseHeight.create(3);
    const baseWidth = BaseWidth.create(3);
    const gameId = GameID.create();
    const answerCandidateCollection = AnswerCandidateCollection.create(
      baseHeight,
      baseWidth,
    );
    CellFactory.create(
      gameId,
      baseHeight,
      baseWidth,
      answerCandidateCollection,
    ).createCells();
    const groupFactory: GroupFactory = GroupFactory.create(
      gameId,
      baseHeight,
      baseWidth,
    );
    const groupRepository = new GroupRepositoryImpl();
    groupFactory.createHyperGroup();
    it('hyperGroups は４つ作られる', () => {
      const hyperGroups = groupRepository.findByType(gameId, GroupType.Hyper);
      expect(hyperGroups.length).toBe(4);
    });
    it('1つめの hyperGroup の座標', () => {
      const hyperGroups = groupRepository.findByType(gameId, GroupType.Hyper);
      expect(
        hyperGroups[0].cells
          .map(cell => cell.position)
          .every(pos =>
            GroupFactory.HYPER_GROUP_POSITIONS[0].some(posB =>
              pos.equals(posB),
            ),
          ),
      ).toBe(true);
    });
    it('2つめの hyperGroup の座標', () => {
      const hyperGroups = groupRepository.findByType(gameId, GroupType.Hyper);
      expect(
        hyperGroups[1].cells
          .map(cell => cell.position)
          .every(pos =>
            GroupFactory.HYPER_GROUP_POSITIONS[1].some(posB =>
              pos.equals(posB),
            ),
          ),
      ).toBe(true);
    });
    it('3つめの hyperGroup の座標', () => {
      const hyperGroups = groupRepository.findByType(gameId, GroupType.Hyper);
      expect(
        hyperGroups[2].cells
          .map(cell => cell.position)
          .every(pos =>
            GroupFactory.HYPER_GROUP_POSITIONS[2].some(posB =>
              pos.equals(posB),
            ),
          ),
      ).toBe(true);
    });
    it('4つめの hyperGroup の座標', () => {
      const hyperGroups = groupRepository.findByType(gameId, GroupType.Hyper);
      expect(
        hyperGroups[3].cells
          .map(cell => cell.position)
          .every(pos =>
            GroupFactory.HYPER_GROUP_POSITIONS[3].some(posB =>
              pos.equals(posB),
            ),
          ),
      ).toBe(true);
    });
  });
});
