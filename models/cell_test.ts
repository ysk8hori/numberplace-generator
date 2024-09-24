import { assert } from 'jsr:@std/assert@1/assert';
import {
  createCells,
  fillCellAnswer,
  セルが未回答か,
  全てのセルが回答済みか,
  重複した答えがあるか,
} from './cell.ts';
import { assertFalse } from '@std/assert';
import { stringToPuzzle } from '../functions/stringToPuzzle.ts';

Deno.test('全てのセルが回答済みかを確認できる', () => {
  const cells = createCells({ height: 1, width: 3 });
  cells[0].answerMut = 0;
  cells[1].answerMut = 1;
  cells[2].answerMut = 2;
  cells[3].answerMut = 1;
  cells[4].answerMut = 2;
  cells[5].answerMut = 0;
  cells[6].answerMut = 2;
  cells[7].answerMut = 0;
  // 未回答セルがある場合
  assert(!全てのセルが回答済みか(cells));
  cells[8].answerMut = 1;
  // 全てのセルが回答済みの場合
  assert(全てのセルが回答済みか(cells));
});

Deno.test('セルが未回答かを確認できる', () => {
  const cells = createCells({ height: 1, width: 3 }, ['standard']);
  assert(セルが未回答か(cells[0]));
  assert(セルが未回答か(cells[1]));
  assert(セルが未回答か(cells[2]));
  assert(セルが未回答か(cells[3]));
  assert(セルが未回答か(cells[4]));
  assert(セルが未回答か(cells[5]));
  assert(セルが未回答か(cells[6]));
  assert(セルが未回答か(cells[7]));
  assert(セルが未回答か(cells[8]));
  fillCellAnswer(0)(cells[0]);
  assertFalse(セルが未回答か(cells[0]));
  assert(セルが未回答か(cells[1]));
  assert(セルが未回答か(cells[2]));
  assert(セルが未回答か(cells[3]));
  assert(セルが未回答か(cells[4]));
  assert(セルが未回答か(cells[5]));
  assert(セルが未回答か(cells[6]));
  assert(セルが未回答か(cells[7]));
  assert(セルが未回答か(cells[8]));
});

Deno.test('重複した答えがあるかを確認できる 重複あり', () => {
  const blockSize = { width: 3, height: 1 };
  const result = stringToPuzzle({
    puzzleStr: '|1|1',
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assert(重複した答えがあるか(result.cells));
});

Deno.test('重複した答えがあるかを確認できる 重複なし', () => {
  const blockSize = { width: 3, height: 1 };
  const result = stringToPuzzle({
    puzzleStr: '|1|21',
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assertFalse(重複した答えがあるか(result.cells));
});
