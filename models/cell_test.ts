import { assert } from 'jsr:@std/assert@1/assert';
import { createCells, 全てのセルが回答済みか } from './cell.ts';

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
