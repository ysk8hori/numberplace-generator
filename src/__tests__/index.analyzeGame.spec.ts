import { analyzeGame } from '@/index';
import { fail } from 'assert';
import { expect, test } from 'vitest';

test('正常な3x3 の問題は solved になる', () => {
  const result = analyzeGame({
    blockSize: { height: 3, width: 3 },
    puzzle: puzzle_3_3,
  });
  if (result.status !== 'solved') {
    fail();
  }
  expect(result.status).toEqual('solved');
  expect(result.solved.cells).toEqual(solved_3_3.cells);
});
test('正常な3x3 hyper cross の問題で gameType を指定しないと multiple_answers になる', () => {
  const result = analyzeGame({
    blockSize: { height: 3, width: 3 },
    puzzle: puzzle_3_3_hyper_cross,
  });
  expect(result.status).toEqual('multiple_answers');
});
test('3x4 hyper の問題は invalid_puzzle になる', () => {
  const result = analyzeGame({
    blockSize: { height: 3, width: 4 },
    puzzle: puzzle_3_3_hyper_cross,
    option: { gameTypes: ['hyper'] },
  });
  expect(result.status).toEqual('invalid_puzzle');
});
test('正常な3x3 hyper cross の問題で gameType を指定すれば solved になる', () => {
  const result = analyzeGame({
    blockSize: { height: 3, width: 3 },
    puzzle: puzzle_3_3_hyper_cross,
    option: { gameTypes: ['cross', 'hyper'] },
  });
  expect(result.status).toEqual('solved');
});
test('正常な3x2 の問題は solved になる', () => {
  const result = analyzeGame({
    blockSize: { height: 2, width: 3 },
    puzzle: puzzle_2_3,
  });
  if (result.status !== 'solved') {
    fail();
  }
  expect(result.status).toEqual('solved');
  expect(result.solved.cells).toEqual(solved_2_3.cells);
});
test('矛盾のある 3x2 の問題は invalid_puzzle になる', () => {
  const result = analyzeGame({
    blockSize: { height: 2, width: 3 },
    puzzle: invalid_puzzle_2_3,
  });
  expect(result.status).toEqual('invalid_puzzle');
});

export const puzzle_2_3 = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0]},{"pos":[1,0],"answer":"2"},{"pos":[2,0]},{"pos":[3,0],"answer":"4"},{"pos":[4,0],"answer":"3"},{"pos":[5,0],"answer":"5"},{"pos":[0,1],"answer":"4"},{"pos":[1,1]},{"pos":[2,1]},{"pos":[3,1]},{"pos":[4,1]},{"pos":[5,1],"answer":"1"},{"pos":[0,2],"answer":"3"},{"pos":[1,2]},{"pos":[2,2]},{"pos":[3,2],"answer":"2"},{"pos":[4,2]},{"pos":[5,2]},{"pos":[0,3]},{"pos":[1,3],"answer":"1"},{"pos":[2,3],"answer":"6"},{"pos":[3,3]},{"pos":[4,3]},{"pos":[5,3]},{"pos":[0,4]},{"pos":[1,4]},{"pos":[2,4],"answer":"2"},{"pos":[3,4]},{"pos":[4,4]},{"pos":[5,4],"answer":"4"},{"pos":[0,5]},{"pos":[1,5],"answer":"6"},{"pos":[2,5],"answer":"4"},{"pos":[3,5]},{"pos":[4,5],"answer":"5"},{"pos":[5,5]}]}',
  ),
};

export const solved_2_3 = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0],"answer":"6"},{"pos":[1,0],"answer":"2"},{"pos":[2,0],"answer":"1"},{"pos":[3,0],"answer":"4"},{"pos":[4,0],"answer":"3"},{"pos":[5,0],"answer":"5"},{"pos":[0,1],"answer":"4"},{"pos":[1,1],"answer":"5"},{"pos":[2,1],"answer":"3"},{"pos":[3,1],"answer":"6"},{"pos":[4,1],"answer":"2"},{"pos":[5,1],"answer":"1"},{"pos":[0,2],"answer":"3"},{"pos":[1,2],"answer":"4"},{"pos":[2,2],"answer":"5"},{"pos":[3,2],"answer":"2"},{"pos":[4,2],"answer":"1"},{"pos":[5,2],"answer":"6"},{"pos":[0,3],"answer":"2"},{"pos":[1,3],"answer":"1"},{"pos":[2,3],"answer":"6"},{"pos":[3,3],"answer":"5"},{"pos":[4,3],"answer":"4"},{"pos":[5,3],"answer":"3"},{"pos":[0,4],"answer":"5"},{"pos":[1,4],"answer":"3"},{"pos":[2,4],"answer":"2"},{"pos":[3,4],"answer":"1"},{"pos":[4,4],"answer":"6"},{"pos":[5,4],"answer":"4"},{"pos":[0,5],"answer":"1"},{"pos":[1,5],"answer":"6"},{"pos":[2,5],"answer":"4"},{"pos":[3,5],"answer":"3"},{"pos":[4,5],"answer":"5"},{"pos":[5,5],"answer":"2"}]}',
  ),
};

export const puzzle_3_3 = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0]},{"pos":[1,0],"answer":"9"},{"pos":[2,0],"answer":"7"},{"pos":[3,0],"answer":"2"},{"pos":[4,0]},{"pos":[5,0]},{"pos":[6,0]},{"pos":[7,0],"answer":"6"},{"pos":[8,0]},{"pos":[0,1],"answer":"6"},{"pos":[1,1]},{"pos":[2,1]},{"pos":[3,1]},{"pos":[4,1],"answer":"4"},{"pos":[5,1],"answer":"8"},{"pos":[6,1]},{"pos":[7,1]},{"pos":[8,1]},{"pos":[0,2]},{"pos":[1,2]},{"pos":[2,2]},{"pos":[3,2]},{"pos":[4,2],"answer":"7"},{"pos":[5,2],"answer":"3"},{"pos":[6,2]},{"pos":[7,2]},{"pos":[8,2]},{"pos":[0,3]},{"pos":[1,3]},{"pos":[2,3],"answer":"9"},{"pos":[3,3],"answer":"4"},{"pos":[4,3]},{"pos":[5,3]},{"pos":[6,3]},{"pos":[7,3]},{"pos":[8,3]},{"pos":[0,4]},{"pos":[1,4]},{"pos":[2,4]},{"pos":[3,4]},{"pos":[4,4]},{"pos":[5,4]},{"pos":[6,4],"answer":"3"},{"pos":[7,4],"answer":"2"},{"pos":[8,4]},{"pos":[0,5]},{"pos":[1,5]},{"pos":[2,5],"answer":"3"},{"pos":[3,5]},{"pos":[4,5]},{"pos":[5,5],"answer":"7"},{"pos":[6,5]},{"pos":[7,5]},{"pos":[8,5],"answer":"6"},{"pos":[0,6]},{"pos":[1,6],"answer":"4"},{"pos":[2,6]},{"pos":[3,6]},{"pos":[4,6]},{"pos":[5,6],"answer":"6"},{"pos":[6,6],"answer":"1"},{"pos":[7,6],"answer":"9"},{"pos":[8,6]},{"pos":[0,7]},{"pos":[1,7]},{"pos":[2,7]},{"pos":[3,7]},{"pos":[4,7]},{"pos":[5,7]},{"pos":[6,7],"answer":"4"},{"pos":[7,7]},{"pos":[8,7],"answer":"7"},{"pos":[0,8]},{"pos":[1,8]},{"pos":[2,8]},{"pos":[3,8],"answer":"3"},{"pos":[4,8],"answer":"2"},{"pos":[5,8]},{"pos":[6,8]},{"pos":[7,8]},{"pos":[8,8]}]}',
  ),
};
export const solved_3_3 = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0],"answer":"4"},{"pos":[1,0],"answer":"9"},{"pos":[2,0],"answer":"7"},{"pos":[3,0],"answer":"2"},{"pos":[4,0],"answer":"1"},{"pos":[5,0],"answer":"5"},{"pos":[6,0],"answer":"8"},{"pos":[7,0],"answer":"6"},{"pos":[8,0],"answer":"3"},{"pos":[0,1],"answer":"6"},{"pos":[1,1],"answer":"3"},{"pos":[2,1],"answer":"5"},{"pos":[3,1],"answer":"9"},{"pos":[4,1],"answer":"4"},{"pos":[5,1],"answer":"8"},{"pos":[6,1],"answer":"2"},{"pos":[7,1],"answer":"7"},{"pos":[8,1],"answer":"1"},{"pos":[0,2],"answer":"8"},{"pos":[1,2],"answer":"1"},{"pos":[2,2],"answer":"2"},{"pos":[3,2],"answer":"6"},{"pos":[4,2],"answer":"7"},{"pos":[5,2],"answer":"3"},{"pos":[6,2],"answer":"9"},{"pos":[7,2],"answer":"5"},{"pos":[8,2],"answer":"4"},{"pos":[0,3],"answer":"5"},{"pos":[1,3],"answer":"6"},{"pos":[2,3],"answer":"9"},{"pos":[3,3],"answer":"4"},{"pos":[4,3],"answer":"3"},{"pos":[5,3],"answer":"2"},{"pos":[6,3],"answer":"7"},{"pos":[7,3],"answer":"1"},{"pos":[8,3],"answer":"8"},{"pos":[0,4],"answer":"7"},{"pos":[1,4],"answer":"8"},{"pos":[2,4],"answer":"4"},{"pos":[3,4],"answer":"5"},{"pos":[4,4],"answer":"6"},{"pos":[5,4],"answer":"1"},{"pos":[6,4],"answer":"3"},{"pos":[7,4],"answer":"2"},{"pos":[8,4],"answer":"9"},{"pos":[0,5],"answer":"1"},{"pos":[1,5],"answer":"2"},{"pos":[2,5],"answer":"3"},{"pos":[3,5],"answer":"8"},{"pos":[4,5],"answer":"9"},{"pos":[5,5],"answer":"7"},{"pos":[6,5],"answer":"5"},{"pos":[7,5],"answer":"4"},{"pos":[8,5],"answer":"6"},{"pos":[0,6],"answer":"3"},{"pos":[1,6],"answer":"4"},{"pos":[2,6],"answer":"8"},{"pos":[3,6],"answer":"7"},{"pos":[4,6],"answer":"5"},{"pos":[5,6],"answer":"6"},{"pos":[6,6],"answer":"1"},{"pos":[7,6],"answer":"9"},{"pos":[8,6],"answer":"2"},{"pos":[0,7],"answer":"2"},{"pos":[1,7],"answer":"5"},{"pos":[2,7],"answer":"6"},{"pos":[3,7],"answer":"1"},{"pos":[4,7],"answer":"8"},{"pos":[5,7],"answer":"9"},{"pos":[6,7],"answer":"4"},{"pos":[7,7],"answer":"3"},{"pos":[8,7],"answer":"7"},{"pos":[0,8],"answer":"9"},{"pos":[1,8],"answer":"7"},{"pos":[2,8],"answer":"1"},{"pos":[3,8],"answer":"3"},{"pos":[4,8],"answer":"2"},{"pos":[5,8],"answer":"4"},{"pos":[6,8],"answer":"6"},{"pos":[7,8],"answer":"8"},{"pos":[8,8],"answer":"5"}]}',
  ),
};

export const invalid_puzzle_2_3 = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0]},{"pos":[1,0],"answer":"1"},{"pos":[2,0]},{"pos":[3,0],"answer":"4"},{"pos":[4,0],"answer":"3"},{"pos":[5,0],"answer":"5"},{"pos":[0,1],"answer":"4"},{"pos":[1,1]},{"pos":[2,1]},{"pos":[3,1]},{"pos":[4,1]},{"pos":[5,1],"answer":"1"},{"pos":[0,2],"answer":"3"},{"pos":[1,2]},{"pos":[2,2]},{"pos":[3,2],"answer":"2"},{"pos":[4,2]},{"pos":[5,2]},{"pos":[0,3]},{"pos":[1,3],"answer":"1"},{"pos":[2,3],"answer":"6"},{"pos":[3,3]},{"pos":[4,3]},{"pos":[5,3]},{"pos":[0,4]},{"pos":[1,4]},{"pos":[2,4],"answer":"2"},{"pos":[3,4]},{"pos":[4,4]},{"pos":[5,4],"answer":"4"},{"pos":[0,5]},{"pos":[1,5],"answer":"6"},{"pos":[2,5],"answer":"4"},{"pos":[3,5]},{"pos":[4,5],"answer":"5"},{"pos":[5,5]}]}',
  ),
};

export const puzzle_3_3_hyper_cross = {
  ...JSON.parse(
    '{"cells":[{"pos":[0,0],"answer":"1"},{"pos":[1,0]},{"pos":[2,0]},{"pos":[3,0]},{"pos":[4,0]},{"pos":[5,0]},{"pos":[6,0]},{"pos":[7,0]},{"pos":[8,0],"answer":"7"},{"pos":[0,1]},{"pos":[1,1]},{"pos":[2,1]},{"pos":[3,1]},{"pos":[4,1]},{"pos":[5,1]},{"pos":[6,1]},{"pos":[7,1],"answer":"3"},{"pos":[8,1]},{"pos":[0,2]},{"pos":[1,2]},{"pos":[2,2]},{"pos":[3,2],"answer":"5"},{"pos":[4,2]},{"pos":[5,2]},{"pos":[6,2]},{"pos":[7,2]},{"pos":[8,2],"answer":"1"},{"pos":[0,3]},{"pos":[1,3],"answer":"4"},{"pos":[2,3]},{"pos":[3,3]},{"pos":[4,3]},{"pos":[5,3]},{"pos":[6,3]},{"pos":[7,3],"answer":"9"},{"pos":[8,3],"answer":"8"},{"pos":[0,4],"answer":"3"},{"pos":[1,4]},{"pos":[2,4],"answer":"5"},{"pos":[3,4]},{"pos":[4,4]},{"pos":[5,4]},{"pos":[6,4]},{"pos":[7,4]},{"pos":[8,4]},{"pos":[0,5]},{"pos":[1,5]},{"pos":[2,5]},{"pos":[3,5]},{"pos":[4,5],"answer":"4"},{"pos":[5,5]},{"pos":[6,5]},{"pos":[7,5],"answer":"6"},{"pos":[8,5]},{"pos":[0,6]},{"pos":[1,6],"answer":"5"},{"pos":[2,6]},{"pos":[3,6]},{"pos":[4,6]},{"pos":[5,6]},{"pos":[6,6]},{"pos":[7,6]},{"pos":[8,6]},{"pos":[0,7]},{"pos":[1,7]},{"pos":[2,7]},{"pos":[3,7]},{"pos":[4,7]},{"pos":[5,7]},{"pos":[6,7],"answer":"1"},{"pos":[7,7]},{"pos":[8,7]},{"pos":[0,8]},{"pos":[1,8]},{"pos":[2,8]},{"pos":[3,8],"answer":"3"},{"pos":[4,8]},{"pos":[5,8],"answer":"2"},{"pos":[6,8]},{"pos":[7,8]},{"pos":[8,8]}]}',
  ),
};
