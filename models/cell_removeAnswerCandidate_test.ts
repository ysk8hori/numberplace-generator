import { flat } from "remeda";
import {
  AnswerCandidate,
  Cell,
  createCells,
  filterByGroup,
  removeAnswerCandidate,
} from "./cell.ts";
import { assertEquals } from "@std/assert";
import { Position } from "./position.ts";

const createCell: (
  answerCnadidatesMut: AnswerCandidate[],
) => (pos: Position) => Cell = (answerCnadidatesMut) => (pos) => ({
  answerMut: undefined,
  answerCnadidatesMut,
  groups: [],
  pos,
});

Deno.test("セルの答えの候補から指定した値を削除できる", () => {
  const cell = createCell([0, 1, 2, 3, 4, 5])([0, 0]);
  removeAnswerCandidate([cell])(3);
  assertEquals(cell.answerCnadidatesMut, [0, 1, 2, 4, 5]);
});

Deno.test("候補の削除対象となったセルを返却する", () => {
  const cell = createCell([0, 1, 2, 3, 4, 5])([0, 0]);
  const result = removeAnswerCandidate([cell])(3);
  assertEquals(result[0], cell);
});

Deno.test("セルの答えの候補に指定した値がなくてもエラー等にならない", () => {
  const cell = createCell([0, 1, 2, 4, 5])([0, 0]);
  removeAnswerCandidate([cell])(3);
  assertEquals(cell.answerCnadidatesMut, [0, 1, 2, 4, 5]);
});

Deno.test("セルの答えの候補に指定した値がなくてもエラー等にならない", () => {
  const cell = createCell([0, 1, 2, 4, 5])([0, 0]);
  const result = removeAnswerCandidate([cell])(3);
  assertEquals(result.length, 0);
});

Deno.test("リストで指定したセル全てから候補を削除できる", () => {
  const cells = createCells({ width: 3, height: 2 });
  const targetCells = filterByGroup(cells)("h3");
  const result = removeAnswerCandidate(targetCells)(5);

  // 削除対象となったセル
  targetCells.forEach((cell) =>
    assertEquals(
      cell.answerCnadidatesMut,
      [0, 1, 2, 3, 4],
      `${JSON.stringify(cell.pos)} のセルで不整合`,
    ),
  );
  assertEquals(result, targetCells);
  // 削除対象と鳴らなかったセル
  flat([
    filterByGroup(cells)("h0"),
    filterByGroup(cells)("h1"),
    filterByGroup(cells)("h2"),
    filterByGroup(cells)("h4"),
    filterByGroup(cells)("h5"),
  ]).forEach((cell) =>
    assertEquals(
      cell.answerCnadidatesMut,
      [0, 1, 2, 3, 4, 5],
      `${JSON.stringify(cell.pos)} のセルで不整合`,
    ),
  );
});
