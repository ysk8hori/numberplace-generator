import { assertEquals } from '@std/assert';
import { createCells, filterByGroup } from './cell.ts';

Deno.test('filterByGroup', () => {
  const cells = createCells({ width: 3, height: 1 });
  const filterByPos = filterByGroup(cells);

  // 念の為グループの状態の確認
  assertEquals(
    cells.map((c) => c.groups),
    [
      ['v0', 'h0', 'b00'],
      ['v1', 'h0', 'b00'],
      ['v2', 'h0', 'b00'],
      ['v0', 'h1', 'b01'],
      ['v1', 'h1', 'b01'],
      ['v2', 'h1', 'b01'],
      ['v0', 'h2', 'b02'],
      ['v1', 'h2', 'b02'],
      ['v2', 'h2', 'b02'],
    ],
  );

  assertEquals(
    filterByPos('v1').map((c) => c.groups),
    [
      ['v1', 'h0', 'b00'],
      ['v1', 'h1', 'b01'],
      ['v1', 'h2', 'b02'],
    ],
  );

  assertEquals(
    filterByPos('h2').map((c) => c.groups),
    [
      ['v0', 'h2', 'b02'],
      ['v1', 'h2', 'b02'],
      ['v2', 'h2', 'b02'],
    ],
  );
});
