import { assertEquals } from "@std/assert";
import { createCells, findCell } from "../models/cell.ts";
import { fillAnswer } from "./fillAnswer.ts";

Deno.test(
  "記入対象のセルに答えを保持し、そのセルが所属するグループの全てのセルの候補から記入した値を除去する",
  () => {
    const cells = createCells({ width: 3, height: 2 });
    const findCellByPos = findCell(cells);
    const targetPos = { x: 2, y: 3 };
    const answer = 4;

    fillAnswer(cells)(targetPos)(answer);

    // 無関係なセルはそのままであること
    assertEquals(findCellByPos({ x: 0, y: 0 }).answerMut, undefined);
    assertEquals(
      findCellByPos({ x: 0, y: 0 }).answerCnadidatesMut,
      [0, 1, 2, 3, 4, 5],
    );

    const targetCell = findCellByPos(targetPos);
    // 答えを記入したセルは答えが入っていること
    assertEquals(targetCell.answerMut, answer);
    // 答えを記入したセルも答えの候補を引き続き管理すること
    assertEquals(targetCell.answerCnadidatesMut, [0, 1, 2, 3, 5]);

    // 同一 horizontalGroup のセルの候補から入力値が削除されていること
    assertEquals(
      findCellByPos({ x: 0, y: 3 }).answerCnadidatesMut,
      [0, 1, 2, 3, 5],
    );
    assertEquals(
      findCellByPos({ x: 5, y: 3 }).answerCnadidatesMut,
      [0, 1, 2, 3, 5],
    );

    // 同一 verticalGroup のセルの候補から入力値が削除されていること
    assertEquals(
      findCellByPos({ x: 2, y: 0 }).answerCnadidatesMut,
      [0, 1, 2, 3, 5],
    );
    assertEquals(
      findCellByPos({ x: 2, y: 5 }).answerCnadidatesMut,
      [0, 1, 2, 3, 5],
    );
  },
);
