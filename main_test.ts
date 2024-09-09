import { assertEquals } from "@std/assert";
import { generateGame } from "./main.ts";

Deno.test(function generateGameTest() {
  const [puzzle, solved] = generateGame({ width: 3, height: 3 });
  assertEquals(puzzle.cells.length, 81);
  assertEquals(solved.cells.length, 81);
});
