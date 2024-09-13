import { assertSnapshot } from "@std/testing/snapshot";
import { type Cell, createCells, 回答できないセルがあるか } from "./cell.ts";
import { assert, assertEquals, assertFalse } from "@std/assert";
import { fillAnswer } from "../functions/fillAnswer.ts";

Deno.test("9x9サイズ position", async (t) => {
  const cells = createCells({ height: 3, width: 3 });
  assertEquals(cells.length, 81);
  assertEquals<Cell>(cells[80], {
    pos: { x: 8, y: 8 },
    groups: ["v8", "h8"],
    answerMut: undefined,
    answerCnadidatesMut: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  });
});

Deno.test("9x9サイズ snapshot", async (t) => {
  const cells = createCells({ height: 3, width: 3 });
  await assertSnapshot(t, cells);
});

Deno.test(
  "3x3サイズのセルを生成する",
  async (t) => await assertSnapshot(t, createCells({ height: 1, width: 3 })),
);

Deno.test("未回答セルの答え候補がなくなった場合は回答できない", () => {
  const cells = createCells({ height: 1, width: 3 });
  assertFalse(回答できないセルがあるか(cells));
  const fillAnswerByPos = fillAnswer(cells);

  fillAnswerByPos({ x: 1, y: 1 })(0);
  assertFalse(回答できないセルがあるか(cells));
  fillAnswerByPos({ x: 1, y: 1 })(1);
  assertFalse(回答できないセルがあるか(cells));
  fillAnswerByPos({ x: 1, y: 1 })(2);
  assert(回答できないセルがあるか(cells));
});
