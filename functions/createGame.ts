import { pipe, shuffle } from 'remeda';
import { calcSideLength, createGameRange } from '../models/blockSize.ts';
import {
  filterByGroup,
  getByPosition,
  refineAnswerCandidateRecursive,
  候補値のスナップショットを取る,
  全てのセルが回答可能か,
  全てのセルが回答済みか,
  未回答のセルを抽出する,
} from '../models/cell.ts';
import { createCells } from '../models/cell.ts';
import type { Game, GameInfo } from '../models/game.ts';
import type { History } from '../models/history.ts';
import { fillAnswer } from './fillAnswer.ts';

export function createGameWrapper(
  { blockSize, difficulty, gameType }: GameInfo,
): Game {
  while (true) {
    try {
      return createGame({ blockSize, difficulty, gameType });
    } catch (e) {
    }
  }
}


export function createGame(
  { blockSize, difficulty, gameType }: GameInfo,
): Game {
  const sideLength = calcSideLength(blockSize);
  /** セルのリスト。巻き戻し時に再生性を行い再割り当てを行うことがある。 */
  let cellsMut = createCells(blockSize, gameType);
  /** 入力履歴 */
  const historiesMut: History[] = [];

  // 最上段のセルに対して、ランダムに解答を割り当てる
  const h0AnswersMut = pipe(createGameRange(sideLength), shuffle<number[]>);
  filterByGroup(cellsMut)(
    'hyper1',
  ).forEach((c) => {
    const answer = h0AnswersMut.pop()!;
    historiesMut.push({
      pos: c.pos,
      answer: answer,
      answerCandidatesMut: c.answerCnadidatesMut.filter((v) => v !== answer),
      isTemporaryInput: true,
    });
    fillAnswer(cellsMut)(c.pos)(answer);
    return c;
  });

  let 試行回数 = 0;
  let 候補値のスナップショット = '';

  // このループのルールとして、break する際には必ず fillAnswer を行うこと。状態が変わらないと無限ループになるため。
  while (true) {
    試行回数++;
    if (300 < 試行回数) {
      // 試行回数が多すぎる場合は問題を生成できないとみなす
      throw new Error('試行回数が多すぎる');
    }
    let flg = false;
    if (80 < 試行回数 && 試行回数 % 10 === 0) {
      // 80回以上の試行回数で、10回ごとにスナップショットを取り、前回と同じスナップショットが取れた場合は無限ループに陥っているため巻き戻しを行う。
      const 前回のスナップショット = 候補値のスナップショット;
      候補値のスナップショット = 候補値のスナップショットを取る(cellsMut);
      flg = 前回のスナップショット === 候補値のスナップショット;
      // if (試行回数 % 100 === 0) {
      //   console.group(`途中経過 ${gameType}`);
      //   console.log('試行回数2', 試行回数);
      //   console.log(前回のスナップショット === 候補値のスナップショット);
      //   console.groupEnd();
      // }
    }
    if (全てのセルが回答済みか(cellsMut)) {
      // すべてのセルに回答が割り当てられた場合は完成
      break;
    }
    refineAnswerCandidateRecursive(cellsMut);
    if (!全てのセルが回答可能か(cellsMut) || flg) {
      flg = false;
      // 回答不可能なセルがある場合は仮入力に誤りがあったといえる。
      // そのため仮入力ポイントまで巻き戻して、別の解答を試す。
      while (true) {
        const history = historiesMut.pop();
        if (history === undefined) {
          // すべての回答を試し終えて問題を生成できないことは本来ない。
          throw new Error('全ての解答を試し終わった');
        }
        // history に対応するセルの回答を削除する
        getByPosition(cellsMut)(history.pos).answerMut = undefined;
        // 仮入力じゃない履歴は以降の処理は不要
        if (!history.isTemporaryInput) continue;

        // 別の仮入力を試すため候補値のリストから一つ消費し、history を更新する。
        const temporaryAnswer = history.answerCandidatesMut.pop();
        if (temporaryAnswer === undefined) {
          // 候補値を全て試していた場合は別の仮入力ポイントまで戻す
          continue;
        }
        // 仮入力実行時にはセルを全てリセットし history から復元するのでここでの解答入力は不要
        // fillAnswer(cellsMut)(history.pos)(temporaryAnswer);
        break;
      }

      // 全てのセルの候補値の再計算を行うため、セルをリセットし history から復元する
      cellsMut = createCells(blockSize);
      historiesMut.forEach((h) => fillAnswer(cellsMut)(h.pos)(h.answer));
      refineAnswerCandidateRecursive(cellsMut);
    }
    // 候補が一つしかないセルを抽出する
    const singleAnswerCells = 未回答のセルを抽出する(cellsMut)
      .filter((c) => c.answerCnadidatesMut.length === 1);
    if (singleAnswerCells.length === 0) {
      // 仮入力をしてリファインメントを行うところから繰り返す

      // 候補が最も少ないセルを抽出する
      const minAnswerCell = 未回答のセルを抽出する(cellsMut).toSorted((a, b) =>
        a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
      ).at(0)!;

      // 候補からランダムに選択して仮入力する
      const shuffledAnswerCandidates = shuffle(
        minAnswerCell.answerCnadidatesMut,
      );
      const temporaryAnswer = shuffledAnswerCandidates.pop()!;
      historiesMut.push({
        pos: minAnswerCell.pos,
        answer: temporaryAnswer,
        answerCandidatesMut: shuffledAnswerCandidates,
        isTemporaryInput: true,
      });
      fillAnswer(cellsMut)(minAnswerCell.pos)(temporaryAnswer);
      continue;
    }
    // 候補が一つしかないセルに対して、その候補を回答として確定する
    singleAnswerCells.forEach((c) => {
      const answer = c.answerCnadidatesMut[0];
      historiesMut.push({
        pos: c.pos,
        answer,
        isTemporaryInput: false,
      });
      fillAnswer(cellsMut)(c.pos)(answer);
    });
  }
  // console.log('試行回数', 試行回数);

  return {
    blockSize,
    difficulty,
    gameType,
    puzzle: cellsMut,
    solved: [],
  };
}

if (import.meta.main) {

  await Deno.writeTextFile(
    './hello.csv',
    `standard,hyper,hypercross\n`,
  );
  for (let i = 0; i < 100; i++) {
    const standardStart = Date.now();
    createGameWrapper({
      blockSize: { width: 3, height: 3 },
      difficulty: 'easy',
      gameType: 'standard',
    });
    const standardEnd = Date.now();
    const hyperStart = Date.now();
    createGameWrapper({
      blockSize: { width: 3, height: 3 },
      difficulty: 'easy',
      gameType: 'hyper',
    });
    const hyperEnd = Date.now();
    const hypercrossStart = Date.now();
    createGameWrapper({
      blockSize: { width: 3, height: 3 },
      difficulty: 'easy',
      gameType: 'hypercross',
    });
    const hypercrossEnd = Date.now();

    await Deno.writeTextFile(
      './hello.csv',
      `${standardEnd - standardStart},${hyperEnd - hyperStart},${
        hypercrossEnd - hypercrossStart
      }\n`,
      {
        append: true,
      },
    );
  }
}
