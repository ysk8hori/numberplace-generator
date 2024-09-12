/** Internal type */
export type Position = { x: number; y: number };

export const createPositions: (range: number[]) => Position[] = (range) =>
  range.flatMap((y) => range.map((x) => ({ x, y })));

export const isSamePos: (a: Position, b: Position) => boolean = (a, b) =>
  a.x === b.x && a.y === b.y;
