import { assertSnapshot } from "@std/testing/snapshot";
import { type Cell, createCells, 全てのセルが回答可能か } from "./cell.ts";
import { assert, assertEquals, assertFalse } from "@std/assert";
import { fillAnswer } from "../functions/fillAnswer.ts";

Deno.test("9x9サイズ position", async (t) => {
  const cells = createCells({ height: 3, width: 3 });
  assertEquals(cells.length, 81);
  assertEquals<Cell>(cells[80], {
    pos: [8, 8],
    groups: ["v8", "h8", "b22"],
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

Deno.test(
  "全てのセルが回答可能か（未回答セルの答え候補がなくなっていないか）を確認できる",
  () => {
    const cells = createCells({ height: 1, width: 3 });
    assert(全てのセルが回答可能か(cells));
    const fillAnswerByPos = fillAnswer(cells);

    fillAnswerByPos([1, 1])(0);
    assert(全てのセルが回答可能か(cells));
    fillAnswerByPos([1, 1])(1);
    assert(全てのセルが回答可能か(cells));
    fillAnswerByPos([1, 1])(2);
    assertFalse(全てのセルが回答可能か(cells));
  },
);

Deno.test("グループの確認", () => {
  const cells = createCells({ width: 3, height: 1 });

  assertEquals(
    cells.map((c) => c.groups),
    [
      ["v0", "h0", "b00"],
      ["v1", "h0", "b00"],
      ["v2", "h0", "b00"],
      ["v0", "h1", "b01"],
      ["v1", "h1", "b01"],
      ["v2", "h1", "b01"],
      ["v0", "h2", "b02"],
      ["v1", "h2", "b02"],
      ["v2", "h2", "b02"],
    ],
  );
});
