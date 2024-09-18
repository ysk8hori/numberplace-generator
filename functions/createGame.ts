import { filter, forEach, pipe, sample, shuffle, sort, tap } from 'remeda';
import {
  BlockSize,
  calcSideLength,
  createGameRange,
} from '../models/blockSize.ts';
import {
  type Cell,
  cellToString,
  filterByGroup,
  findCell,
  getByPosition,
  refineAnswerCandidateRecursive,
  候補値のスナップショットを取る,
  全てのセルが回答可能か,
  全てのセルが回答済みか,
  回答済みのセルを抽出する,
  未回答のセルを抽出する,
} from '../models/cell.ts';
import { createCells } from '../models/cell.ts';
import type { Game, GameInfo, GameType } from '../models/game.ts';
import type { History } from '../models/history.ts';
import { fillAnswer } from './fillAnswer.ts';
import { 仮入力無しで解けるか } from './canSolveWithoutTemporaryInput.ts';

function getMinimumAnsweredCellsCount(
  blockSize: BlockSize,
  gameType: GameType,
): number | undefined {
  if (gameType !== 'standard') return undefined;
  switch (calcSideLength(blockSize)) {
    case 3:
      return 3;
    case 9:
      return 29;
    default:
      return undefined;
  }
}
function 最大試行回数を取得する(
  blockSize: BlockSize,
  gameType: GameType,
): number {
  switch (gameType) {
    case 'standard':
      switch (calcSideLength(blockSize)) {
        case 12:
          return 80;
        case 16:
          return 200;
        default:
          return 35;
      }
    case 'hyper':
      return 35;
    case 'cross':
      switch (calcSideLength(blockSize)) {
        case 6:
          return 25;
        case 9:
          return 30;
        case 12:
          return 80;
        case 16:
          return 200;
        default:
          return 35;
      }
    case 'hypercross':
      return 100;
  }
}

export function createGameWrapper(
  { blockSize, difficulty, gameType }: GameInfo,
): Game {
  let errorCount = 0;
  while (true) {
    const result = createGame({ blockSize, difficulty, gameType });
    if (result.status === 'success') {
      return result.game;
    }

    errorCount++;
    console.log('errorCount', errorCount, result.message);
  }
}

export function createGame(
  { blockSize, difficulty, gameType }: GameInfo,
): { status: 'success'; game: Game } | { status: 'error'; message: string } {
  /** セルのリスト。巻き戻し時に再生性を行い再割り当てを行うことがある。 */
  let cellsMut = createCells(blockSize, gameType);
  /** 入力履歴 */
  const historiesMut: History[] = [];

  // // 特定のグループに対して、ランダムに解答を割り当てる → 問題にそのままこのグループが埋まった状態で残るのでやらない。
  // const sideLength = calcSideLength(blockSize);
  // const h0AnswersMut = pipe(createGameRange(sideLength), shuffle<number[]>);
  // filterByGroup(cellsMut)(
  //   gameType === 'hyper' || gameType === 'hypercross' ? 'b11': `h${sample(createGameRange(sideLength),1).at(0)}`,
  // ).forEach((c) => {
  //   const answer = h0AnswersMut.pop()!;
  //   historiesMut.push({
  //     pos: c.pos,
  //     answer: answer,
  //     answerCandidatesMut: c.answerCnadidatesMut.filter((v) => v !== answer),
  //     isTemporaryInput: true,
  //   });
  //   fillAnswer(cellsMut)(c.pos)(answer);
  //   return c;
  // });

  let 試行回数 = 0;
  let 候補値のスナップショット = '';

  // このループのルールとして、break する際には必ず fillAnswer を行うこと。状態が変わらないと無限ループになるため。
  while (true) {
    試行回数++;
    if (最大試行回数を取得する(blockSize, gameType) < 試行回数) { // history を巻き戻して試すよりも、ダメなら最初からやり直すほうが早いようだ。
      // 試行回数が多すぎる場合は問題を生成できないとみなす
      return { status: 'error', 'message': `試行回数エラー ${試行回数}` };
    }
    let flg = false;
    // if (試行回数 % 10 === 0) {
    //   // 80回以上の試行回数で、10回ごとにスナップショットを取り、前回と同じスナップショットが取れた場合は無限ループに陥っているため巻き戻しを行う。
    //   const 前回のスナップショット = 候補値のスナップショット;
    //   候補値のスナップショット = 候補値のスナップショットを取る(cellsMut);
    //   flg = 前回のスナップショット === 候補値のスナップショット;
    //   if (試行回数 % 100 === 0) {
    //     console.group(`途中経過 ${gameType}`);
    //     console.log('試行回数2', 試行回数);
    //     console.log(前回のスナップショット === 候補値のスナップショット);
    //     console.groupEnd();
    //   }
    // }
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
          // throw new Error('全ての解答を試し終わった');
          return {
            status: 'error',
            message: '全ての解答を試し終わったが問題を生成できなかった',
          };
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
      cellsMut = createCells(blockSize, gameType);
      historiesMut.forEach((h) => fillAnswer(cellsMut)(h.pos)(h.answer));
      refineAnswerCandidateRecursive(cellsMut);
    }
    // 候補が一つしかないセルを抽出する
    const singleAnswerCells = 未回答のセルを抽出する(cellsMut)
      .filter((c) => c.answerCnadidatesMut.length === 1);
    if (singleAnswerCells.length === 0) {
      // 仮入力をしてリファインメントを行うところから繰り返す

      // 候補が最も少ないセルを抽出する
      const minAnswerCell = sample(
        未回答のセルを抽出する(cellsMut).toSorted((a, b) =>
          a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
        ),
        1,
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
  console.log('試行回数', 試行回数);
  console.log(
    'historiesMut',
    historiesMut.filter((h) => h.isTemporaryInput).length,
  );

  const puzzle = 穴あけ4(blockSize, gameType, [...historiesMut]);
  const threashold = getMinimumAnsweredCellsCount(blockSize, gameType);
  if (
    threashold !== undefined &&
    threashold <= pipe(puzzle, 回答済みのセルを抽出する).length
  ) {
    return {
      status: 'error',
      message: `最小回答数が ${pipe(puzzle, 回答済みのセルを抽出する).length}`,
    };
  }
  console.log(
    '回答済みのセル',
    //   pipe(tmpPuzzle, 回答済みのセルを抽出する).length,
    pipe(puzzle, 回答済みのセルを抽出する).length,
  );
  // const 仮入力無しで解ける = 仮入力無しで解けるか(puzzle, {
  //   blockSize,
  //   gameType,
  // });
  // console.log(仮入力無しで解ける);
  // if (!仮入力無しで解ける) {
  //   console.log(cellToString(puzzle));
  //   throw new Error('仮入力無しで解けない');
  // }

  return {
    status: 'success',
    game: {
      blockSize,
      difficulty,
      gameType,
      puzzle: puzzle,
      solved: cellsMut,
    },
  };
}

async function hoge() {
  if (import.meta.main) {
    // await Deno.writeTextFile(
    //   './hello.csv',
    //   `standard,standard count,hyper,hyper count,hypercross,hypercross count\n`,
    // );
    for (let i = 0; i < 1; i++) {
      await hypercrossを含まない時間計測処理();
    }
    // 全タイプ生成してみる();
  }
}

hoge();

function 全タイプ生成してみる() {
  console.group('▼standard3x3');
  console.time('standard3x3');
  const standard3 = createGameWrapper({
    blockSize: { width: 3, height: 1 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard3x3');
  console.log('\nstandard\n', cellToString(standard3.puzzle));
  console.groupEnd();

  console.group('▼standard4x4');
  console.time('standard4x4');
  const standard4 = createGameWrapper({
    blockSize: { width: 2, height: 2 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard4x4');
  console.log('\nstandard4\n', cellToString(standard4.puzzle));
  console.groupEnd();

  console.group('▼standard6x6');
  console.time('standard6x6');
  const standard6 = createGameWrapper({
    blockSize: { width: 3, height: 2 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard6x6');
  console.log('\nstandard6\n', cellToString(standard6.puzzle));
  console.groupEnd();

  console.group('▼standard6x6cross');
  console.time('standard6x6cross');
  const standard6c = createGameWrapper({
    blockSize: { width: 3, height: 2 },
    difficulty: 'easy',
    gameType: 'cross',
  });
  console.timeEnd('standard6x6cross');
  console.log('\nstandard6c\n', cellToString(standard6c.puzzle));
  console.groupEnd();

  console.group('▼standard');
  console.time('standard');
  const standard = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard');
  console.log('\nstandard\n', cellToString(standard.puzzle));
  console.groupEnd();

  console.group('▼hyper');
  console.time('hyper');
  const hyper = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'hyper',
  });
  console.timeEnd('hyper');
  console.log('\nhyper\n', cellToString(hyper.puzzle));
  console.groupEnd();

  console.group('▼cross');
  console.time('cross');
  const cross = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'cross',
  });
  console.timeEnd('cross');
  console.log('\ncross\n', cellToString(cross.puzzle));
  console.groupEnd();

  console.group('▼standard12x12');
  console.time('standard12x12');
  const standard12 = createGameWrapper({
    blockSize: { width: 4, height: 3 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard12x12');
  console.log('\nstandard12\n', cellToString(standard12.puzzle));
  console.groupEnd();

  console.group('▼standard16x16');
  console.time('standard16x16');
  const standard16 = createGameWrapper({
    blockSize: { width: 4, height: 4 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  console.timeEnd('standard16x16');
  console.log('\nstandard16\n', cellToString(standard16.puzzle));
  console.groupEnd();
}

async function hypercrossを含まない時間計測処理() {
  console.group('▼standard');
  const standardStart = Date.now();
  const standard = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  const standardEnd = Date.now();
  console.log('\nstandard\n', cellToString(standard.puzzle));
  console.groupEnd();

  console.group('▼hyper');
  const hyperStart = Date.now();
  const hyper = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'hyper',
  });
  const hyperEnd = Date.now();
  console.log('\nhyper\n', cellToString(hyper.puzzle));
  console.groupEnd();

  await Deno.writeTextFile(
    './hello.csv',
    `${standardEnd - standardStart},${
      回答済みのセルを抽出する(standard.puzzle).length
    },${hyperEnd - hyperStart},${
      回答済みのセルを抽出する(hyper.puzzle).length
    }\n`,
    {
      append: true,
    },
  );
}

async function hypercrossを含む時間計測処理() {
  console.group('▼standard');
  const standardStart = Date.now();
  const standard = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'standard',
  });
  const standardEnd = Date.now();
  console.log('\nstandard\n', cellToString(standard.puzzle));
  console.groupEnd();

  console.group('▼hyper');
  const hyperStart = Date.now();
  const hyper = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'hyper',
  });
  const hyperEnd = Date.now();
  console.log('\nhyper\n', cellToString(hyper.puzzle));
  console.groupEnd();

  console.group('▼hypercross');
  const hypercrossStart = Date.now();
  const hypercross = createGameWrapper({
    blockSize: { width: 3, height: 3 },
    difficulty: 'easy',
    gameType: 'hypercross',
  });
  const hypercrossEnd = Date.now();
  console.log(cellToString(hypercross.puzzle));
  console.log('\nhypercross\n', cellToString(hypercross.puzzle));
  console.groupEnd();

  await Deno.writeTextFile(
    './hello.csv',
    `${standardEnd - standardStart},${
      回答済みのセルを抽出する(standard.puzzle).length
    },${hyperEnd - hyperStart},${
      回答済みのセルを抽出する(hyper.puzzle).length
    },${hypercrossEnd - hypercrossStart},${
      回答済みのセルを抽出する(hypercross.puzzle).length
    },\n`,
    {
      append: true,
    },
  );
}

function 穴あけ4(
  blockSize: BlockSize,
  gameType: GameType,
  historiesMut: History[],
): Cell[] {
  const 仮入力の履歴 = historiesMut.filter((h) => h.isTemporaryInput);
  const historiesLength = 仮入力の履歴.length;
  const tmpPuzzle = createCells(blockSize, gameType);
  for (let i = 0; i < historiesLength; i++) {
    console.log('仮入力の履歴', 仮入力の履歴.length);
    const history = 仮入力の履歴.shift()!;
    仮入力の履歴.forEach((h) => fillAnswer(tmpPuzzle)(h.pos)(h.answer));
    if (!仮入力無しで解けるか(tmpPuzzle, { blockSize, gameType })) {
      仮入力の履歴.push(history);
    }
  }
  return tmpPuzzle;
}

function 穴あけ３(
  blockSize: BlockSize,
  gameType: GameType,
  cellsMut: Cell[],
): Cell[] {
  const tmpPuzzle = createCells(blockSize, gameType);
  const shuffled = shuffle(cellsMut);
  for (let answer = 0; answer < calcSideLength(blockSize) - 1; answer++) {
    const c = shuffled.find((c) => c.answerMut === answer)!;
    fillAnswer(tmpPuzzle)(c.pos)(c.answerMut!);
  }

  while (!仮入力無しで解けるか(tmpPuzzle, { blockSize, gameType })) {
    // 候補が最も少ないセルを抽出する
    // const minAnswerCell = shuffle(
    //   未回答のセルを抽出する(tmpPuzzle).toSorted((a, b) =>
    //     a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
    //   ),
    // ).at(0)!;

    const 候補が最も多いセル = shuffle(未回答のセルを抽出する(tmpPuzzle))
      .toSorted((a, b) =>
        a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
      ).at(0)!;
    const 候補が最も多いセルの答えを持つセル = findCell(cellsMut)(
      候補が最も多いセル.pos,
    )!;
    fillAnswer(tmpPuzzle)(候補が最も多いセルの答えを持つセル.pos)(
      候補が最も多いセルの答えを持つセル.answerMut!,
    );

    // pipe(
    //   tmpPuzzle,
    //   未回答のセルを抽出する,
    //   (l)=>shuffle(l),
    //   // 候補が最も少ないセルを抽出する
    //   sort((a, b) =>
    //     a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
    //   ),
    //   ([c]) => findCell(cellsMut)(c!.pos)!,
    //   tap(console.log),
    //   (c) => fillAnswer(tmpPuzzle)(c.pos)(c.answerMut!)
    // );
    // console.log(cellToString(tmpPuzzle));

    // fillAnswer(tmpPuzzle)(minAnswerCell.pos)(minAnswerCell.answerMut!);
  }

  return tmpPuzzle;
}

function 穴あけ2(
  blockSize: BlockSize,
  gameType: GameType,
  cellsMut: Cell[],
): Cell[] {
  const tmpPuzzle = createCells(blockSize, gameType);
  const shuffled = shuffle(cellsMut);
  for (let answer = 0; answer < calcSideLength(blockSize) - 1; answer++) {
    const c = shuffled.find((c) => c.answerMut === answer)!;
    fillAnswer(tmpPuzzle)(c.pos)(c.answerMut!);
  }

  while (!仮入力無しで解けるか(tmpPuzzle, { blockSize, gameType })) {
    // 候補が最も少ないセルを抽出する
    // const minAnswerCell = shuffle(
    //   未回答のセルを抽出する(tmpPuzzle).toSorted((a, b) =>
    //     a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
    //   ),
    // ).at(0)!;

    pipe(
      tmpPuzzle,
      未回答のセルを抽出する,
      // 候補が最も少ないセルを抽出する
      sort((a, b) =>
        a.answerCnadidatesMut.length - b.answerCnadidatesMut.length
      ),
      sample(1),
      ([c]) => findCell(cellsMut)(c!.pos)!,
      tap(console.log),
      (c) => fillAnswer(tmpPuzzle)(c.pos)(c.answerMut!),
    );
    console.log(cellToString(tmpPuzzle));

    // fillAnswer(tmpPuzzle)(minAnswerCell.pos)(minAnswerCell.answerMut!);
  }

  return tmpPuzzle;
}

function 穴あけ1(
  blockSize: BlockSize,
  gameType: GameType,
  cellsMut: Cell[],
): Cell[] {
  /** シャッフルしたセルのリスト。 ここから問題を解くのに必要最低限のセルを puzzle へ移植する。 */
  const tmpPuzzle = createCells(blockSize, gameType);

  // 出来上がった答えをシャッフルして tmpPuzzle に答えを移植する
  for (const c of shuffle(cellsMut)) {
    fillAnswer(tmpPuzzle)(c.pos)(c.answerMut!);
    refineAnswerCandidateRecursive(tmpPuzzle);
    // 全てのセルが回答可能になるまで埋める
    if (仮入力無しで解けるか(tmpPuzzle, { blockSize, gameType })) break;
  }

  // tmpPuzzle を更に絞って puzzle に移植する
  const shuffledTmpPuzzle = shuffle(回答済みのセルを抽出する(tmpPuzzle));
  for (let i = 0; i < 回答済みのセルを抽出する(tmpPuzzle).length; i++) {
    const tmptmpPuzzle = createCells(blockSize, gameType);
    const tmpCell = shuffledTmpPuzzle.pop()!;

    // console.log('shuffledTmpPuzzle', shuffledTmpPuzzle.length);
    // 一つ少ないパズルとして転機する
    for (const c of shuffledTmpPuzzle) {
      fillAnswer(tmptmpPuzzle)(c.pos)(c.answerMut!);
    }
    // console.log(
    //   'tmptmpPuzzle',
    //   pipe(tmptmpPuzzle, 回答済みのセルを抽出する).length,
    // );
    // 仮入力無しで解けるなら tmpCell はなくても良いが、解けないなら tmpCell は必要なので puzzle に移植する
    if (!仮入力無しで解けるか(tmptmpPuzzle, { blockSize, gameType })) {
      shuffledTmpPuzzle.unshift(tmpCell);
    }
  }
  const puzzle = createCells(blockSize, gameType);
  for (const c of shuffledTmpPuzzle) {
    fillAnswer(puzzle)(c.pos)(c.answerMut!);
  }
  return puzzle;
}
