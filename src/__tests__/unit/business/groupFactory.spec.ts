import GroupFactory from '@/core/factory/groupFactory';
import { createCells } from '@/core/factory/cellFactory';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import CellPosition from '@/core/valueobject/cellPosition';
import GameID from '@/core/valueobject/gameId';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import { GroupType } from '@/core/entity/group';
import { describe, it, expect } from 'vitest';
import { container } from 'tsyringe';

describe('GroupFactory', () => {
  const baseHeight = BaseHeight.create(2);
  const baseWidth = BaseWidth.create(3);
  const gameId = GameID.create();
  const answerCandidateCollection = AnswerCandidateCollection.create(
    baseHeight,
    baseWidth,
  );
  createCells({
    gameId,
    baseHeight,
    baseWidth,
    answerCandidateCollection,
    cellRepository: container.resolve('CellRepository'),
  });
  const groupFactory: GroupFactory = GroupFactory.create(
    gameId,
    baseHeight,
    baseWidth,
  );
  const groupRepository = new GroupRepositoryImpl();
  describe('縦グループの生成', () => {
    groupFactory.createVerticalGroup();
    const verticalGroups = groupRepository.findByType(
      gameId,
      GroupType.Vertical,
    );
    it('0,0', () => {
      expect(
        verticalGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0),
        ),
      ).toBeTruthy();
    });
    it('verticalGroups[0].cells[5].isSamePosition(CellPosition.create(0, 5))', () => {
      expect(
        verticalGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(0, 5),
        ),
      ).toBeTruthy();
    });
    it('verticalGroups[3].cells[0].isSamePosition(CellPosition.create(3, 0))', () => {
      expect(
        verticalGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 0),
        ),
      ).toBeTruthy();
    });
    it('verticalGroups[3].cells[5].isSamePosition(CellPosition.create(3, 5))', () => {
      expect(
        verticalGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(3, 5),
        ),
      ).toBeTruthy();
    });
    it('verticalGroups[5].cells[0].isSamePosition(CellPosition.create(5, 0))', () => {
      expect(
        verticalGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(5, 0),
        ),
      ).toBeTruthy();
    });
    it('verticalGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        verticalGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5),
        ),
      ).toBeTruthy();
    });
  });
  describe('横グループの生成', () => {
    groupFactory.createHorizontalGroup();
    const horizontalGroups = groupRepository.findByType(
      gameId,
      GroupType.Horizontal,
    );
    it('horizontalGroups[0].cells[0].isSamePosition(CellPosition.create(0, 0))', () => {
      expect(
        horizontalGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0),
        ),
      ).toBeTruthy();
    });
    it('horizontalGroups[0].cells[5].isSamePosition(CellPosition.create(5, 0))', () => {
      expect(
        horizontalGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 0),
        ),
      ).toBeTruthy();
    });
    it('horizontalGroups[3].cells[0].isSamePosition(CellPosition.create(0, 3))', () => {
      expect(
        horizontalGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 3),
        ),
      ).toBeTruthy();
    });
    it('horizontalGroups[3].cells[5].isSamePosition(CellPosition.create(5, 3))', () => {
      expect(
        horizontalGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 3),
        ),
      ).toBeTruthy();
    });
    it('horizontalGroups[5].cells[0].isSamePosition(CellPosition.create(0, 5))', () => {
      expect(
        horizontalGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 5),
        ),
      ).toBeTruthy();
    });
    it('horizontalGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        horizontalGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5),
        ),
      ).toBeTruthy();
    });
  });
  describe('SQUAREグループの生成', () => {
    groupFactory.createSquareGroup();
    const squareGroups = groupRepository.findByType(gameId, GroupType.Square);
    it('squareGroups[0].cells[0].isSamePosition(CellPosition.create(0, 0))', () => {
      expect(
        squareGroups[0].cells[0].isSamePosition(
          CellPosition.createFromNumber(0, 0),
        ),
      ).toBeTruthy();
    });
    it('squareGroups[0].cells[5].isSamePosition(CellPosition.create(2, 1))', () => {
      expect(
        squareGroups[0].cells[5].isSamePosition(
          CellPosition.createFromNumber(2, 1),
        ),
      ).toBeTruthy();
    });
    it('squareGroups[3].cells[0].isSamePosition(CellPosition.create(3, 2))', () => {
      expect(
        squareGroups[3].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 2),
        ),
      ).toBeTruthy();
    });
    it('squareGroups[3].cells[5].isSamePosition(CellPosition.create(5, 3))', () => {
      expect(
        squareGroups[3].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 3),
        ),
      ).toBeTruthy();
    });
    it('squareGroups[5].cells[0].isSamePosition(CellPosition.create(3, 4))', () => {
      expect(
        squareGroups[5].cells[0].isSamePosition(
          CellPosition.createFromNumber(3, 4),
        ),
      ).toBeTruthy();
    });
    it('squareGroups[5].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
      expect(
        squareGroups[5].cells[5].isSamePosition(
          CellPosition.createFromNumber(5, 5),
        ),
      ).toBeTruthy();
    });
  });
  describe('クロスグループの生成', () => {
    groupFactory.createCrossGroup();
    const crossGroups = groupRepository.findByType(gameId, GroupType.Cross);
    describe('左上から右下への斜めのグループ', () => {
      it('crossGroups[0].cells[0].isSamePosition(CellPosition.create(0, 0))', () => {
        expect(
          crossGroups[0].cells[0].isSamePosition(
            CellPosition.createFromNumber(0, 0),
          ),
        ).toBeTruthy();
      });
      it('crossGroups[0].cells[1].isSamePosition(CellPosition.create(1, 1))', () => {
        expect(crossGroups[0].cells[1].position).toEqual(
          CellPosition.createFromNumber(1, 1),
        );
      });
      it('crossGroups[0].cells[2].isSamePosition(CellPosition.create(2, 2))', () => {
        expect(crossGroups[0].cells[2].position).toEqual(
          CellPosition.createFromNumber(2, 2),
        );
      });
      it('crossGroups[0].cells[3].isSamePosition(CellPosition.create(3, 3))', () => {
        expect(crossGroups[0].cells[3].position).toEqual(
          CellPosition.createFromNumber(3, 3),
        );
      });
      it('crossGroups[0].cells[4].isSamePosition(CellPosition.create(4, 4))', () => {
        expect(crossGroups[0].cells[4].position).toEqual(
          CellPosition.createFromNumber(4, 4),
        );
      });
      it('crossGroups[0].cells[5].isSamePosition(CellPosition.create(5, 5))', () => {
        expect(crossGroups[0].cells[5].position).toEqual(
          CellPosition.createFromNumber(5, 5),
        );
      });
      it('crossGroups[0].cells[6] is undefind', () => {
        expect(crossGroups[0].cells[6]).toBeUndefined();
      });
    });
    describe('右上から左下への斜めのグループ', () => {
      it('crossGroups[1].cells[0].isSamePosition(CellPosition.create(5, 0))', () => {
        expect(
          crossGroups[1].cells[0].isSamePosition(
            CellPosition.createFromNumber(5, 0),
          ),
        ).toBeTruthy();
      });
      it('crossGroups[1].cells[1].isSamePosition(CellPosition.create(4, 1))', () => {
        expect(crossGroups[1].cells[1].position).toEqual(
          CellPosition.createFromNumber(4, 1),
        );
      });
      it('crossGroups[1].cells[2].isSamePosition(CellPosition.create(3, 2))', () => {
        expect(crossGroups[1].cells[2].position).toEqual(
          CellPosition.createFromNumber(3, 2),
        );
      });
      it('crossGroups[1].cells[3].isSamePosition(CellPosition.create(2, 3))', () => {
        expect(crossGroups[1].cells[3].position).toEqual(
          CellPosition.createFromNumber(2, 3),
        );
      });
      it('crossGroups[1].cells[4].isSamePosition(CellPosition.create(1, 4))', () => {
        expect(crossGroups[1].cells[4].position).toEqual(
          CellPosition.createFromNumber(1, 4),
        );
      });
      it('crossGroups[1].cells[5].isSamePosition(CellPosition.create(0, 5))', () => {
        expect(crossGroups[1].cells[5].position).toEqual(
          CellPosition.createFromNumber(0, 5),
        );
      });
      it('crossGroups[1].cells[6] is undefind', () => {
        expect(crossGroups[1].cells[6]).toBeUndefined();
      });
    });
  });
});
