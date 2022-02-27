import GroupFactory from '@/core/factory/groupFactory';
import CellFactory from '@/core/factory/cellFactory';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import CellPosition from '@/core/valueobject/cellPosition';
import GameID from '@/core/valueobject/gameId';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import { GroupType } from '@/core/entity/group';
import { describe, it, expect } from 'vitest';

describe('GroupFactory', () => {
  const baseHeight = BaseHeight.create(2);
  const baseWidth = BaseWidth.create(3);
  const gameId = GameID.create();
  const answerCandidateCollection = AnswerCandidateCollection.create(
    baseHeight,
    baseWidth
  );
  CellFactory.create(
    gameId,
    baseHeight,
    baseWidth,
    answerCandidateCollection
  ).createCells();
  const groupFactory: GroupFactory = GroupFactory.create(
    gameId,
    baseHeight,
    baseWidth
  );
  const groupRepository = new GroupRepositoryImpl();
  describe('縦グループの生成', () => {
    groupFactory.createVerticalGroup();
    const verticalGroups = groupRepository.findByType(
      gameId,
      GroupType.Vertical
    );
    it('0,0', () => {
      expect(
        verticalGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0)
        )
      ).toBeTruthy();
    });
    it('verticalGroups[0].cells[5].isSamePosition(CellPosition.create(0, 5))', () => {
      expect(
        verticalGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(0, 5)
        )
      ).toBeTruthy();
    });
    it('verticalGroups[3].cells[0].isSamePosition(CellPosition.create(3, 0))', () => {
      expect(
        verticalGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 0)
        )
      ).toBeTruthy();
    });
    it('verticalGroups[3].cells[5].isSamePosition(CellPosition.create(3, 5))', () => {
      expect(
        verticalGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(3, 5)
        )
      ).toBeTruthy();
    });
    it('verticalGroups[5].cells[0].isSamePosition(CellPosition.create(5, 0))', () => {
      expect(
        verticalGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(5, 0)
        )
      ).toBeTruthy();
    });
    it('verticalGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        verticalGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5)
        )
      ).toBeTruthy();
    });
  });
  describe('横グループの生成', () => {
    groupFactory.createHorizontalGroup();
    const horizontalGroups = groupRepository.findByType(
      gameId,
      GroupType.Horizontal
    );
    it('horizontalGroups[0].cells[0].isSamePosition(CellPosition.create(0, 0))', () => {
      expect(
        horizontalGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0)
        )
      ).toBeTruthy();
    });
    it('horizontalGroups[0].cells[5].isSamePosition(CellPosition.create(5, 0))', () => {
      expect(
        horizontalGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 0)
        )
      ).toBeTruthy();
    });
    it('horizontalGroups[3].cells[0].isSamePosition(CellPosition.create(0, 3))', () => {
      expect(
        horizontalGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 3)
        )
      ).toBeTruthy();
    });
    it('horizontalGroups[3].cells[5].isSamePosition(CellPosition.create(5, 3))', () => {
      expect(
        horizontalGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 3)
        )
      ).toBeTruthy();
    });
    it('horizontalGroups[5].cells[0].isSamePosition(CellPosition.create(0, 5))', () => {
      expect(
        horizontalGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 5)
        )
      ).toBeTruthy();
    });
    it('horizontalGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        horizontalGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5)
        )
      ).toBeTruthy();
    });
  });
  describe('SQUAREグループの生成', () => {
    groupFactory.createSquareGroup();
    const squareGroups = groupRepository.findByType(gameId, GroupType.Square);
    it('squareGroups[0].cells[0].isSamePosition(CellPosition.create(0, 0))', () => {
      expect(
        squareGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0)
        )
      ).toBeTruthy();
    });
    it('squareGroups[0].cells[5].isSamePosition(CellPosition.create(2, 1))', () => {
      expect(
        squareGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(2, 1)
        )
      ).toBeTruthy();
    });
    it('squareGroups[3].cells[0].isSamePosition(CellPosition.create(3, 2))', () => {
      expect(
        squareGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 2)
        )
      ).toBeTruthy();
    });
    it('squareGroups[3].cells[5].isSamePosition(CellPosition.create(5, 3))', () => {
      expect(
        squareGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 3)
        )
      ).toBeTruthy();
    });
    it('squareGroups[5].cells[0].isSamePosition(CellPosition.create(3, 4))', () => {
      expect(
        squareGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 4)
        )
      ).toBeTruthy();
    });
    it('squareGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        squareGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5)
        )
      ).toBeTruthy();
    });
  });
});
