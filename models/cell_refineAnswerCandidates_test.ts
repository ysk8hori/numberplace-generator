import { assert, assertEquals, assertFalse } from "@std/assert";
import {
  type Cell,
  getUniqueAnswercandidatesList,
  refineAnswerCandidate,
  同じ答え候補をもつセルの数が答え候補の数と同じか,
} from "./cell.ts";

const cells = [
  {
    pos: [0, 0],
    answerCnadidatesMut: [0, 1],
    answerMut: undefined,
    groups: ["h0"],
  } satisfies Cell,
  {
    pos: [1, 0],
    answerCnadidatesMut: [0, 1],
    answerMut: undefined,
    groups: ["h0"],
  } satisfies Cell,
  {
    pos: [2, 0],
    answerCnadidatesMut: [0, 1, 2],
    answerMut: undefined,
    groups: ["h0"],
  } satisfies Cell,
];

Deno.test(
  "getUniqueAnswercandidatesList は同一グループのセルが持つ候補のリストのユニークなリストを取得する",
  () => {
    assertEquals(getUniqueAnswercandidatesList(cells), [
      [0, 1],
      [0, 1, 2],
    ]);
  },
);

Deno.test("同じ答え候補をもつセルの数が答え候補の数と同じか", () => {
  assert(同じ答え候補をもつセルの数が答え候補の数と同じか(cells)([0, 1]));
  assertFalse(
    同じ答え候補をもつセルの数が答え候補の数と同じか(cells)([0, 1, 2]),
  );
});

Deno.test("hoge", () => {
  refineAnswerCandidate(cells);

  assertEquals(cells[2].answerCnadidatesMut, [2]);
});
Deno.test("fuga", () => {
  const cells = [
    {
      pos: [1, 0],
      answerCnadidatesMut: [0, 2],
      answerMut: undefined,
      groups: ["v1"],
    } satisfies Cell,
    {
      pos: [1, 1],
      answerCnadidatesMut: [0, 2],
      answerMut: undefined,
      groups: ["v1"],
    } satisfies Cell,
    {
      pos: [1, 2],
      answerCnadidatesMut: [0, 1, 2],
      answerMut: undefined,
      groups: ["v1"],
    } satisfies Cell,
  ];

  refineAnswerCandidate(cells);

  assertEquals(cells[2].answerCnadidatesMut, [1]);
});
