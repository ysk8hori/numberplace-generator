import { filter } from 'remeda';
import { forEach } from 'remeda';
import { pipe } from 'remeda';
import {
  type Cell,
  createCells,
  refineAnswerCandidateRecursive,
  全てのセルが回答可能か,
  全てのセルが回答済みか,
  回答済みのセルを抽出する,
  未回答のセルを抽出する,
  重複した答えがあるか,
} from '../models/cell.ts';
import type { GameInfo } from '../models/game.ts';
import { fillAnswer } from './fillAnswer.ts';

export function 仮入力無しで解けるか(
  途中まで入力済みのパズル: Cell[],
  { blockSize, gameType }: Pick<GameInfo, 'blockSize' | 'gameType'>,
): boolean {
  // 受け取ったパズルを汚染したくないのでコピーを作成する
  const 入力済みのパズルが解けるかを試すためのパズル = createCells(
    blockSize,
    gameType,
  );
  pipe(
    途中まで入力済みのパズル,
    回答済みのセルを抽出する,
    forEach((c) =>
      fillAnswer(入力済みのパズルが解けるかを試すためのパズル)(c.pos)(
        c.answerMut!,
      )
    ),
  );

  while (true) {
    refineAnswerCandidateRecursive(
      入力済みのパズルが解けるかを試すためのパズル,
    );
    if (重複した答えがあるか(入力済みのパズルが解けるかを試すためのパズル)) {
      return false;
    }
    if (!全てのセルが回答可能か(入力済みのパズルが解けるかを試すためのパズル)) {
      return false;
    }
    const 未回答かつ候補が一つしかないセルのリスト = pipe(
      入力済みのパズルが解けるかを試すためのパズル,
      未回答のセルを抽出する,
      filter(
        (c) => c.answerCnadidatesMut.length === 1,
      ),
    );
    if (未回答かつ候補が一つしかないセルのリスト.length === 0) {
      // 候補が一つしか無いセルがなくなったら失敗
      return false;
    }
    // 候補が一つしかないセルに対して、その候補を回答として確定する
    未回答かつ候補が一つしかないセルのリスト.forEach((c) => {
      fillAnswer(入力済みのパズルが解けるかを試すためのパズル)(c.pos)(
        c.answerCnadidatesMut[0],
      );
    });
    if (全てのセルが回答済みか(入力済みのパズルが解けるかを試すためのパズル)) {
      return true;
    }
  }
}
