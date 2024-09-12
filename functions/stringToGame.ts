import { type Cell, createCells } from "../models/cell.ts";
import { type BlockSize, calcSideLength } from "../models/game.ts";
import { isSamePos } from "../models/position.ts";

type StringToPuzzleFailureStatus =
  | "invalid_size"
  | "not_implemented"
  | "invalid_answer";

/**
 * 文字列を問題へと変換する
 * - 各セルの答えと答えの間には colSplitter に指定されている文字が使用されていると仮定する
 * - 改行には rowSplitter に指定されている文字が使用されていると仮定する
 * - answer の値が空の場合は empty の値が使用されていると仮定する
 * - answer の値は16進数文字列であると仮定する
 *   - 現状、16以上の数字は本アプリでは使用しない。
 */
export function stringToPuzzle({
  blockSize,
  puzzleStr,
  rowSplitter = "|",
  colSplitter = "",
  empty = " ",
}: {
  blockSize: BlockSize;
  puzzleStr: string;
  rowSplitter?: string;
  colSplitter?: string;
  empty?: string;
}):
  | { status: StringToPuzzleFailureStatus }
  | {
      status: "success";
      cells: Cell[];
    } {
  const rowsStr = puzzleStr.split(rowSplitter);
  if (
    rowsStr.length < 3 ||
    16 < rowsStr.length ||
    calcSideLength(blockSize) < rowsStr.length
  ) {
    return { status: "invalid_size" };
  }
  /** 注：rowsAnswers での answer はまだ16進の文字 */
  const rowsAnswers = rowsStr.map((rowStr) => rowStr.split(colSplitter));
  if (
    !rowsAnswers.every((answers) =>
      answers.every(
        (a) =>
          a === empty ||
          (!isNaN(parseInt(a, 16)) &&
            parseInt(a, 16) < calcSideLength(blockSize)),
      ),
    )
  ) {
    return { status: "invalid_answer" };
  }
  if (rowsAnswers.some((answers) => rowsAnswers.length < answers.length)) {
    // 正方形になっていない場合（行の数を超える列数がある場合）は不正なサイズ
    return { status: "invalid_size" };
  }
  // 全てのセルを作る
  const cells = createCells(blockSize);
  // セルに答えを転写する
  rowsAnswers.forEach((answers, y) =>
    answers.forEach((a, x) => {
      if (a === empty) return;
      const answer = parseInt(a, 16);
      const cell = cells.find((cell) => isSamePos(cell.pos, { x, y }));
      if (!cell) return;
      cell.answerMut = answer;
    }),
  );

  return { status: "success", cells };
}
