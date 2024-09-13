import { createCell, createCells, removeAnswerCandidate } from "./cell.ts";
import { assertEquals } from "@std/assert";

Deno.test("セルの答えの候補から指定した値を削除できる", () => {
  const cell = createCell([0, 1, 2, 3, 4, 5])({ x: 0, y: 0 });
  removeAnswerCandidate(cell)(3);
  assertEquals(cell.answerCnadidatesMut, [0, 1, 2, 4, 5]);
});

Deno.test("セルの答えの候補に指定した値がなくてもエラー等にならない", () => {
  const cell = createCell([0, 1, 2, 4, 5])({ x: 0, y: 0 });
  removeAnswerCandidate(cell)(3);
  assertEquals(cell.answerCnadidatesMut, [0, 1, 2, 4, 5]);
});

Deno.test("セルの答えの候補がなくてもエラー等にならない", () => {
  const cell = createCell([])({ x: 0, y: 0 });
  removeAnswerCandidate(cell)(3);
  assertEquals(cell.answerCnadidatesMut, []);
});

Deno.test("リストで指定したセル全てから候補を削除できる", () => {
  const cells = createCells({ width: 3, height: 2 });
  removeAnswerCandidate(cells)(5);
  cells.forEach((cell) =>
    assertEquals(
      cell.answerCnadidatesMut,
      [0, 1, 2, 3, 4],
      `${JSON.stringify(cell.pos)} のセルで不整合`,
    ),
  );
});
