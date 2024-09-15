import { pipe, shuffle } from 'remeda';
import { calcSideLength, createGameRange } from '../models/blockSize.ts';
import {
  cellToString,
  filterByGroup,
  getByPosition,
  refineAnswerCandidateRecursive,
  全てのセルが回答可能か,
  全てのセルが回答済みか,
  未回答のセルを抽出する,
} from '../models/cell.ts';
import { createCells } from '../models/cell.ts';
import type { Game, GameInfo } from '../models/game.ts';
import type { History } from '../models/history.ts';
import { fillAnswer } from './fillAnswer.ts';

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
  filterByGroup(cellsMut)('h0').forEach((c) => {
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

  // このループのルールとして、break する際には必ず fillAnswer を行うこと。状態が変わらないと無限ループになるため。
  while (true) {
    if (全てのセルが回答済みか(cellsMut)) {
      // すべてのセルに回答が割り当てられた場合は完成
      break;
    }
    refineAnswerCandidateRecursive(cellsMut);
    if (!全てのセルが回答可能か(cellsMut)) {
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

  return {
    blockSize,
    difficulty,
    gameType,
    puzzle: cellsMut,
    solved: [],
  };
}

if (import.meta.main) {
  const game = createGame({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.log(cellToString(game.puzzle));
  console.log(cellToString(game.solved));
}
