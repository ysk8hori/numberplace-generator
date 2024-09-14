import { stringToPuzzle } from "./stringToGame.ts";
import { assertEquals, assertObjectMatch } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import type { Cell } from "../models/cell.ts";
import { throwError } from "../utils/utils.ts";

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
    assertObjectMatch(result.cells.at(0)!, {
      pos: [0, 0],
      answerCnadidatesMut: [7],
      answerMut: 7,
      groups: ["v0", "h0"],
    } satisfies Partial<Cell>);
    assertObjectMatch(result.cells.at(-1)!, {
      pos: [15, 15],
      answerCnadidatesMut: [3, 5, 7, 11],
      answerMut: undefined,
      groups: ["v15", "h15"],
    } satisfies Partial<Cell>);
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
    assertObjectMatch(result.cells[0], {
      pos: [0, 0],
      answerCnadidatesMut: [0],
      answerMut: undefined,
      groups: ["v0", "h0"],
    } satisfies Partial<Cell>);
    // 答えに0が入るセル
    assertObjectMatch(
      result.cells.find(({ pos }) => pos[0] === 1 && pos[1] === 5)!,
      {
        pos: [1, 5],
        answerCnadidatesMut: [0],
        answerMut: 0,
        groups: ["v1", "h5"],
      } satisfies Partial<Cell>,
    );
  } else {
    throw new Error(`Test failed. ${result.status}`);
  }
  await assertSnapshot(t, result);
});

Deno.test("puzzle_3_1", () => {
  const result = stringToPuzzle({
    blockSize: { width: 3, height: 1 },
    puzzleStr: "|  1|12",
  });
  if (result.status !== "success")
    throwError(`ステータスが不正：${result.status}`);

  assertEquals(result.cells[0], {
    pos: [0, 0],
    answerCnadidatesMut: [0],
    answerMut: undefined,
    groups: ["v0", "h0", "b00"],
  } satisfies Cell);

  assertEquals(result.cells[1], {
    pos: [1, 0],
    answerCnadidatesMut: [1],
    answerMut: undefined,
    groups: ["v1", "h0", "b00"],
  } satisfies Cell);

  assertEquals(result.cells[2], {
    pos: [2, 0],
    answerCnadidatesMut: [2],
    answerMut: undefined,
    groups: ["v2", "h0", "b00"],
  } satisfies Cell);
});
