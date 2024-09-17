import {
  type Cell,
  createCells,
  refineAnswerCandidateRecursive,
} from '../models/cell.ts';
import { type BlockSize, calcSideLength } from '../models/blockSize.ts';
import type { Position } from '../models/position.ts';
import { fillAnswer } from './fillAnswer.ts';

type StringToPuzzleFailureStatus =
  | 'invalid_size'
  | 'not_implemented'
  | 'invalid_answer';

/**
 * 文字列を問題へと変換する

 * - 各セルの答えと答えの間には colSplitter に指定されている文字が使用されていると仮定する
 * - 改行には rowSplitter に指定されている文字が使用されていると仮定する
 * - answer の値が空の場合は empty の値が使用されていると仮定する
 * - answer の値は16進数文字列であると仮定する
 *   - answer の値は 0-9,a-fを想定
 *   - 現状、16以上の数字は本アプリでは使用しない。
 */
export function stringToPuzzle({
  blockSize,
  puzzleStr,
  rowSplitter = '|',
  colSplitter = '',
}: {
  blockSize: BlockSize;
  puzzleStr: string;
  rowSplitter?: string;
  colSplitter?: string;
}):
  | { status: StringToPuzzleFailureStatus }
  | {
    status: 'success';
    cells: Cell[];
  } {
  const sideLength = calcSideLength(blockSize);
  const rowsStr = puzzleStr.split(rowSplitter);

  if (
    rowsStr.length < 3 ||
    16 < rowsStr.length ||
    sideLength < rowsStr.length
  ) {
    return { status: 'invalid_size' };
  }
  /** 注：rowsAnswers での answer はまだ16進の文字 */
  const rowsAnswers = rowsStr.map((rowStr) => rowStr.split(colSplitter));
  if (rowsAnswers.some((answers) => rowsAnswers.length < answers.length)) {
    // 正方形になっていない場合（行の数を超える列数がある場合）は不正なサイズ
    return { status: 'invalid_size' };
  }
  const answerAndPos = rowsAnswers
    .flatMap((answers, y) =>
      answers.map(
        (a, x) => [parseInt(a, 16), [x, y] satisfies Position] as const,
      )
    )
    .filter(([a]) => !isNaN(a));
  if (answerAndPos.some(([a]) => sideLength <= a)) {
    // 想定サイズより大きい場合は invalid_answer
    return { status: 'invalid_answer' };
  }
  // 全てのセルを作る
  const cells = createCells(blockSize);
  // セルに答えを転写する
  const fillByPos = fillAnswer(cells);
  answerAndPos.forEach(([a, p]) => fillByPos(p)(a));

  // 全体の候補のリファインメントを実施する
  refineAnswerCandidateRecursive(cells);

  return { status: 'success', cells };
}
