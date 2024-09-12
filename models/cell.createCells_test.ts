import { assertSnapshot } from "@std/testing/snapshot";
import { type Cell, createCells } from "./cell.ts";
import { assertEquals } from "@std/assert";

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
