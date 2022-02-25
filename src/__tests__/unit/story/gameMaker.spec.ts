import Game from '@/core/entity/game';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import CellPosition from '@/core/valueobject/cellPosition';
import Answer from '@/core/valueobject/answer';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GroupID from '@/core/valueobject/groupId';

describe('GameMaker', () => {
  describe('2×3のゲーム', () => {
    const game: Game = Game.create(BaseHeight.create(2), BaseWidth.create(3));
    const cellRepository = CellRepositoryImpl.create();
    test('Gameのインスタンスが生成されること', () => {
      expect(game).toBeDefined();
    });
    // test('AnswerMapを取得できること', () => {
    //   expect(game.answerMap).toBeDefined();
    // });
    test('[0,0]のCellのグループがh0,v0,s0であること', () => {
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
    test('[0,1]のCellのグループにs0が含まれていること', () => {
      expect(
        cellRepository.findByPosition(
          game.gameId,
          CellPosition.createFromNumber(0, 1)
        ).groupIds
      ).toContainEqual(GroupID.create(game.gameId, 's0'));
    });
    describe('解答の入力', () => {
      describe('[0,0]のCellに1を記入する', () => {
        beforeAll(() => {
          game.fill(CellPosition.createFromNumber(0, 0), Answer.create('1'));
        });
        it('[0,0]のCellのAnswerが"1"となること', () => {
          expect(game.getAnswer(CellPosition.createFromNumber(0, 0))).toEqual(
            Answer.create('1')
          );
        });
        it.each`
          hPos | vPos
          ${0} | ${0}
          ${1} | ${0}
          ${2} | ${0}
          ${3} | ${0}
          ${4} | ${0}
          ${5} | ${0}
          ${0} | ${1}
          ${1} | ${1}
          ${2} | ${1}
          ${0} | ${2}
          ${0} | ${3}
          ${0} | ${4}
          ${0} | ${5}
        `(
          '同一グループのCellのAnswerCandidateから"1"が除外されていること($hPos, $vPos)',
          ({ vPos, hPos }: { vPos: number; hPos: number }) => {
            expect(
              game.getAnswerCandidate(
                CellPosition.create(
                  VerticalPosition.create(vPos),
                  HorizontalPosition.create(hPos)
                )
              )
            ).not.toContain('1');
          }
        );
        it.each`
          vPos | hPos
          ${1} | ${3}
          ${1} | ${4}
          ${1} | ${5}
          ${2} | ${1}
          ${2} | ${2}
          ${2} | ${3}
          ${2} | ${4}
          ${2} | ${5}
          ${3} | ${1}
          ${3} | ${2}
          ${3} | ${3}
          ${3} | ${4}
          ${3} | ${5}
          ${4} | ${1}
          ${4} | ${2}
          ${4} | ${3}
          ${4} | ${4}
          ${4} | ${5}
          ${5} | ${1}
          ${5} | ${2}
          ${5} | ${3}
          ${5} | ${4}
          ${5} | ${5}
        `(
          '同一グループ外のCellのAnswerCandidateから"1"が除外されていないこと($hPos, $vPos)',
          ({ vPos, hPos }: { vPos: number; hPos: number }) => {
            expect(
              game.getAnswerCandidate(
                CellPosition.create(
                  VerticalPosition.create(vPos),
                  HorizontalPosition.create(hPos)
                )
              )
            ).toContain('1');
          }
        );
      });
    });
  });
});
