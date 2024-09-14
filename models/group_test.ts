import { assertEquals } from "@std/assert";
import { getBlockGroup } from "./group.ts";
import { BlockSize } from "./game.ts";

Deno.test("getBlockGroup 6x6", () => {
  const bs = { width: 3, height: 2 } satisfies BlockSize;
  // 1行目
  assertEquals(getBlockGroup(bs)([0, 0]), "b00");
  assertEquals(getBlockGroup(bs)([1, 0]), "b00");
  assertEquals(getBlockGroup(bs)([2, 0]), "b00");
  assertEquals(getBlockGroup(bs)([3, 0]), "b10");
  assertEquals(getBlockGroup(bs)([4, 0]), "b10");
  assertEquals(getBlockGroup(bs)([5, 0]), "b10");
  // 2行目
  assertEquals(getBlockGroup(bs)([0, 1]), "b00");
  assertEquals(getBlockGroup(bs)([1, 1]), "b00");
  assertEquals(getBlockGroup(bs)([2, 1]), "b00");
  assertEquals(getBlockGroup(bs)([3, 1]), "b10");
  assertEquals(getBlockGroup(bs)([4, 1]), "b10");
  assertEquals(getBlockGroup(bs)([5, 1]), "b10");

  // 3行目
  assertEquals(getBlockGroup(bs)([0, 2]), "b01");
  assertEquals(getBlockGroup(bs)([1, 2]), "b01");
  assertEquals(getBlockGroup(bs)([2, 2]), "b01");
  assertEquals(getBlockGroup(bs)([3, 2]), "b11");
  assertEquals(getBlockGroup(bs)([4, 2]), "b11");
  assertEquals(getBlockGroup(bs)([5, 2]), "b11");
  // 4行目
  assertEquals(getBlockGroup(bs)([0, 3]), "b01");
  assertEquals(getBlockGroup(bs)([1, 3]), "b01");
  assertEquals(getBlockGroup(bs)([2, 3]), "b01");
  assertEquals(getBlockGroup(bs)([3, 3]), "b11");
  assertEquals(getBlockGroup(bs)([4, 3]), "b11");
  assertEquals(getBlockGroup(bs)([5, 3]), "b11");

  // 5行目
  assertEquals(getBlockGroup(bs)([0, 4]), "b02");
  assertEquals(getBlockGroup(bs)([1, 4]), "b02");
  assertEquals(getBlockGroup(bs)([2, 4]), "b02");
  assertEquals(getBlockGroup(bs)([3, 4]), "b12");
  assertEquals(getBlockGroup(bs)([4, 4]), "b12");
  assertEquals(getBlockGroup(bs)([5, 4]), "b12");
  // 6行目
  assertEquals(getBlockGroup(bs)([0, 5]), "b02");
  assertEquals(getBlockGroup(bs)([1, 5]), "b02");
  assertEquals(getBlockGroup(bs)([2, 5]), "b02");
  assertEquals(getBlockGroup(bs)([3, 5]), "b12");
  assertEquals(getBlockGroup(bs)([4, 5]), "b12");
  assertEquals(getBlockGroup(bs)([5, 5]), "b12");
});
