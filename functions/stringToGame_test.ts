import { stringToPuzzle } from "./stringToGame.ts";
import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import type { Cell } from "../models/cell.ts";

Deno.test("不正なサイズのパズル（小さい）", () => {
  const result = stringToPuzzle({
    blockSize: { height: 1, width: 3 },
    puzzleStr: "12|34",
  });
  assertEquals(result.status, "invalid_size");
});
Deno.test("不正なサイズのパズル（大きい）", () => {
  const result = stringToPuzzle({
    blockSize: { height: 16, width: 16 },
    puzzleStr:
      "1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234|1234",
  });
  assertEquals(result.status, "invalid_size");
});
Deno.test("不正なサイズのパズル（1行の長さが大きすぎる）", () => {
  const result = stringToPuzzle({
    blockSize: { width: 2, height: 2 },
    puzzleStr: "0123|0123|0123|01230",
  });
  assertEquals(result.status, "invalid_size");
});
Deno.test("不正な答えを含むパズル（大きすぎる）", () => {
  const result = stringToPuzzle({
    blockSize: { width: 2, height: 2 },
    puzzleStr: "0123|0123|0123|1243",
  });
  assertEquals(result.status, "invalid_answer");
});
Deno.test("puzzle_4_4", async (t) => {
  const result = stringToPuzzle({
    blockSize: { width: 4, height: 4 },
    puzzleStr:
      "70dxexxxxxx452nx8xcx972xxdxxx3nxxxxxxxxx5n9xx6xx3xxxxxx1bn2xxxxxxxxxx5xxxanxx173xx8xx6x9enxxx3xefxxa0xx8x4nxxa87xx9x1nfxxx5xxxxx8xxx4nxxx2dxxxxxxx89xenbaxxx2xxxx5x3xf6n3c8xxx4xbx7xxxd1nxxxxxx2cxxxxx0xdnxxxxxxxax3xx1cnxxbxxxx4xxexxxx2n1d298xx6acf",
    colSplitter: "",
    rowSplitter: "n",
  });
  if (result.status === "success") {
    assertEquals(result.cells[0], {
      pos: { x: 0, y: 0 },
      answerCnadidatesMut: [6, 8, 10, 12],
      answerMut: 7,
      groups: ["v0", "h0"],
    } satisfies Cell);
    assertEquals(result.cells.at(-1), {
      pos: { x: 15, y: 15 },
      answerCnadidatesMut: [0, 3, 5, 7, 11],
      answerMut: undefined,
      groups: ["v15", "h15"],
    } satisfies Cell);
  } else {
    throw new Error(`Test failed. ${result.status}`);
  }
  await assertSnapshot(t, result);
});
Deno.test("puzzle_2_3", async (t) => {
  const result = stringToPuzzle({
    blockSize: { width: 2, height: 3 },
    puzzleStr: " 2 435|4    1|3  2| 10|  2  4| 04 5",
  });
  if (result.status === "success") {
    // 最初のセル
    assertEquals(result.cells[0], {
      pos: { x: 0, y: 0 },
      answerCnadidatesMut: [0, 1],
      answerMut: undefined,
      groups: ["v0", "h0"],
    } satisfies Cell);
    // 答えに0が入るセル
    assertEquals(
      result.cells.find(({ pos }) => pos.x === 1 && pos.y === 5),
      {
        pos: { x: 1, y: 5 },
        answerCnadidatesMut: [3],
        answerMut: 0,
        groups: ["v1", "h5"],
      } satisfies Cell,
    );
  } else {
    throw new Error(`Test failed. ${result.status}`);
  }
  await assertSnapshot(t, result);
});
