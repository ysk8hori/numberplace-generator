import { assertEquals } from '@std/assert';
import { getBlockGroup, getTLBRGroup, getTRBLGroup } from './group.ts';
import type { BlockSize } from './blockSize.ts';

Deno.test('getBlockGroup 6x6', () => {
  const bs = { width: 3, height: 2 } satisfies BlockSize;
  // 1行目
  assertEquals(getBlockGroup(bs)([0, 0]), 'b00');
  assertEquals(getBlockGroup(bs)([1, 0]), 'b00');
  assertEquals(getBlockGroup(bs)([2, 0]), 'b00');
  assertEquals(getBlockGroup(bs)([3, 0]), 'b10');
  assertEquals(getBlockGroup(bs)([4, 0]), 'b10');
  assertEquals(getBlockGroup(bs)([5, 0]), 'b10');
  // 2行目
  assertEquals(getBlockGroup(bs)([0, 1]), 'b00');
  assertEquals(getBlockGroup(bs)([1, 1]), 'b00');
  assertEquals(getBlockGroup(bs)([2, 1]), 'b00');
  assertEquals(getBlockGroup(bs)([3, 1]), 'b10');
  assertEquals(getBlockGroup(bs)([4, 1]), 'b10');
  assertEquals(getBlockGroup(bs)([5, 1]), 'b10');

  // 3行目
  assertEquals(getBlockGroup(bs)([0, 2]), 'b01');
  assertEquals(getBlockGroup(bs)([1, 2]), 'b01');
  assertEquals(getBlockGroup(bs)([2, 2]), 'b01');
  assertEquals(getBlockGroup(bs)([3, 2]), 'b11');
  assertEquals(getBlockGroup(bs)([4, 2]), 'b11');
  assertEquals(getBlockGroup(bs)([5, 2]), 'b11');
  // 4行目
  assertEquals(getBlockGroup(bs)([0, 3]), 'b01');
  assertEquals(getBlockGroup(bs)([1, 3]), 'b01');
  assertEquals(getBlockGroup(bs)([2, 3]), 'b01');
  assertEquals(getBlockGroup(bs)([3, 3]), 'b11');
  assertEquals(getBlockGroup(bs)([4, 3]), 'b11');
  assertEquals(getBlockGroup(bs)([5, 3]), 'b11');

  // 5行目
  assertEquals(getBlockGroup(bs)([0, 4]), 'b02');
  assertEquals(getBlockGroup(bs)([1, 4]), 'b02');
  assertEquals(getBlockGroup(bs)([2, 4]), 'b02');
  assertEquals(getBlockGroup(bs)([3, 4]), 'b12');
  assertEquals(getBlockGroup(bs)([4, 4]), 'b12');
  assertEquals(getBlockGroup(bs)([5, 4]), 'b12');
  // 6行目
  assertEquals(getBlockGroup(bs)([0, 5]), 'b02');
  assertEquals(getBlockGroup(bs)([1, 5]), 'b02');
  assertEquals(getBlockGroup(bs)([2, 5]), 'b02');
  assertEquals(getBlockGroup(bs)([3, 5]), 'b12');
  assertEquals(getBlockGroup(bs)([4, 5]), 'b12');
  assertEquals(getBlockGroup(bs)([5, 5]), 'b12');
});

Deno.test('getTLBRGroup は盤面の左上から右下への対角線のグループを返す', () => {
  assertEquals(getTLBRGroup([0, 0]), 'TLBR');
  assertEquals(getTLBRGroup([1, 0]), undefined);
  assertEquals(getTLBRGroup([5, 0]), undefined);
  assertEquals(getTLBRGroup([1, 1]), 'TLBR');
  assertEquals(getTLBRGroup([5, 5]), 'TLBR');
});

Deno.test('getTRBLGroup は盤面の右上から左下への対角線のグループを返す', () => {
  const bs = { width: 3, height: 2 } satisfies BlockSize;
  assertEquals(getTRBLGroup(bs)([4, 0]), undefined);
  assertEquals(getTRBLGroup(bs)([5, 0]), 'TRBL');
  assertEquals(getTRBLGroup(bs)([4, 1]), 'TRBL');
  assertEquals(getTRBLGroup(bs)([3, 3]), undefined);
  assertEquals(getTRBLGroup(bs)([0, 5]), 'TRBL');
});
