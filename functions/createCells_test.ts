import { assertSnapshot } from "@std/testing/snapshot";
import { createCells } from "./createCells.ts";

Deno.test(
  "9x9サイズのセルを生成する",
  async (t) => await assertSnapshot(t, createCells({ height: 3, width: 3 })),
);

Deno.test(
  "3x3サイズのセルを生成する",
  async (t) => await assertSnapshot(t, createCells({ height: 1, width: 3 })),
);
