import { 仮入力無しで解けるか } from './canSolveWithoutTemporaryInput.ts';
import { stringToPuzzle } from './stringToPuzzle.ts';
import { assert, assertFalse } from '@std/assert';

Deno.test('仮入力無しで解けない場合は false を返す', () => {
  const blockSize = { width: 3, height: 3 };
  const result = stringToPuzzle({
    puzzleStr:
      ' 8       |        |  7 2   |        |     3  | 5  6   |    78  |        |      03',
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assertFalse(
    仮入力無しで解けるか(result.cells, { blockSize, gameType: 'standard' }),
    '解けないはず',
  );
});

Deno.test('仮入力無しで解ける場合は true を返す', () => {
  const blockSize = { width: 3, height: 3 };
  const result = stringToPuzzle({
    puzzleStr:
      '4       1| 5   1 4 |  8 476  | 70|  3 7 2|      50|  681 0| 4 0   7|2       5',
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assert(
    仮入力無しで解けるか(result.cells, { blockSize, gameType: 'standard' }),
    '解けるはず',
  );
});

Deno.test('仮入力無しで解けない場合は false を返す 3x3', () => {
  const blockSize = { width: 3, height: 1 };
  const result = stringToPuzzle({
    puzzleStr: '1||',
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assertFalse(
    仮入力無しで解けるか(result.cells, { blockSize, gameType: 'standard' }),
    '解けないはず',
  );
});

Deno.test('仮入力無しで解ける場合は true を返す 3x3', () => {
  const blockSize = { width: 3, height: 1 };
  const result = stringToPuzzle({
    puzzleStr: '|1|1', // 1つの列に重複した答えがある
    blockSize,
    colSplitter: '',
    rowSplitter: '|',
  });

  if (result.status !== 'success') {
    throw new Error(`Test failed. ${result.status}`);
  }

  assertFalse(
    仮入力無しで解けるか(result.cells, { blockSize, gameType: 'standard' }),
    '解けないはず',
  );
});
