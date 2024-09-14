import { pipe, tap } from 'remeda';
import {
  type Answer,
  type Cell,
  fillCellAnswer,
  filterByGroup,
  findCell,
  isCellsPosition,
  removeAnswerCandidate,
} from '../models/cell.ts';
import type { Position } from '../models/position.ts';
import { isNot } from 'remeda';

export const fillAnswer: (
  cells: Cell[],
) => (p: Position) => (a: Answer) => void = (cl) => (p) => (a) =>
  pipe(
    findCell(cl)(p),
    // 答えを記入
    tap(fillCellAnswer(a)),
    // ターゲットと同じグループのセルから候補を除去
    tap((c) =>
      c.groups
        .map(filterByGroup(cl.filter(isNot(isCellsPosition(p)))))
        .map(removeAnswerCandidate)
        .forEach((f) => f(a))
    ),
  );
