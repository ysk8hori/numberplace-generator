import { assertEquals } from '@std/assert';
import { createCells, findCell } from '../models/cell.ts';
import { fillAnswer } from './fillAnswer.ts';
import type { Position } from '../models/position.ts';

Deno.test(
  '記入対象のセルに答えを保持し、そのセルが所属するグループの全てのセルの候補から記入した値を除去する',
  () => {
    const cells = createCells({ width: 3, height: 2 });
    const findCellByPos = findCell(cells);
    const targetPos: Position = [2, 3];
    const answer = 4;

    fillAnswer(cells)(targetPos)(answer);

    // 無関係なセルはそのままであること
    assertEquals(findCellByPos([0, 0]).answerMut, undefined);
    assertEquals(findCellByPos([0, 0]).answerCnadidatesMut, [0, 1, 2, 3, 4, 5]);

    const targetCell = findCellByPos(targetPos);
    // 答えを記入したセルは答えが入っていること
    assertEquals(targetCell.answerMut, answer);
    // 答えを記入したセルの候補はその答えのみになること
    assertEquals(targetCell.answerCnadidatesMut, [answer]);

    // 同一 horizontalGroup のセルの候補から入力値が削除されていること
    assertEquals(findCellByPos([0, 3]).answerCnadidatesMut, [0, 1, 2, 3, 5]);
    assertEquals(findCellByPos([5, 3]).answerCnadidatesMut, [0, 1, 2, 3, 5]);

    // 同一 verticalGroup のセルの候補から入力値が削除されていること
    assertEquals(findCellByPos([2, 0]).answerCnadidatesMut, [0, 1, 2, 3, 5]);
    assertEquals(findCellByPos([2, 5]).answerCnadidatesMut, [0, 1, 2, 3, 5]);
  },
);

Deno.test(
  '1列回答したときに、それらのセルは解答と候補値が一致している',
  () => {
    const cells = createCells({ width: 1, height: 3 });
    const findCellByPos = findCell(cells);

    fillAnswer(cells)([0, 0])(0);
    fillAnswer(cells)([1, 0])(1);
    fillAnswer(cells)([2, 0])(2);

    assertEquals(findCellByPos([0, 0]).answerMut, 0);
    assertEquals(findCellByPos([0, 0]).answerCnadidatesMut[0], 0);
    assertEquals(findCellByPos([1, 0]).answerMut, 1);
    assertEquals(findCellByPos([1, 0]).answerCnadidatesMut[0], 1);
    assertEquals(findCellByPos([2, 0]).answerMut, 2);
    assertEquals(findCellByPos([2, 0]).answerCnadidatesMut[0], 2);
  },
);
