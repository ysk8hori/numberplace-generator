import { assert, assertEquals, assertFalse } from '@std/assert';
import {
  type Cell,
  getUniqueAnswercandidatesList,
  refineAnswerCandidateRecursive,
  同じ答え候補をもつセルの数が答え候補の数と同じか,
} from './cell.ts';

const cells = [
  {
    pos: [0, 0],
    answerCnadidatesMut: [0, 1],
    answerMut: undefined,
    groups: ['h0'],
  } satisfies Cell,
  {
    pos: [1, 0],
    answerCnadidatesMut: [0, 1],
    answerMut: undefined,
    groups: ['h0'],
  } satisfies Cell,
  {
    pos: [2, 0],
    answerCnadidatesMut: [0, 1, 2],
    answerMut: undefined,
    groups: ['h0'],
  } satisfies Cell,
];

Deno.test(
  'getUniqueAnswercandidatesList は同一グループのセルが持つ候補のリストのユニークなリストを取得する',
  () => {
    assertEquals(getUniqueAnswercandidatesList(cells), [
      [0, 1],
      [0, 1, 2],
    ]);
  },
);

Deno.test('同じ答え候補をもつセルの数が答え候補の数と同じか', () => {
  assert(同じ答え候補をもつセルの数が答え候補の数と同じか(cells)([0, 1]));
  assertFalse(
    同じ答え候補をもつセルの数が答え候補の数と同じか(cells)([0, 1, 2]),
  );
});

Deno.test(
  'refineAnswerCandidateRecursive は、同じ候補値のリストを持つセルの数がその候補値のリスト長と同じ場合は、それらを持つセル達のみにそれらの候補値が当てはまるはずであるため、他のセルからそれらの候補値を削除する',
  () => {
    refineAnswerCandidateRecursive(cells);

    assertEquals(cells[2].answerCnadidatesMut, [2]);
  },
);
Deno.test('fuga', () => {
  const cells = [
    {
      pos: [1, 0],
      answerCnadidatesMut: [0, 2],
      answerMut: undefined,
      groups: ['h0', 'v1'],
    } satisfies Cell,
    {
      pos: [1, 1],
      answerCnadidatesMut: [0, 2],
      answerMut: undefined,
      groups: ['h1', 'v1'],
    } satisfies Cell,
    {
      pos: [1, 2],
      answerCnadidatesMut: [0, 1, 2],
      answerMut: undefined,
      groups: ['h2', 'v1'],
    } satisfies Cell,
  ];

  refineAnswerCandidateRecursive(cells);

  assertEquals(cells[2].answerCnadidatesMut, [1]);
});
