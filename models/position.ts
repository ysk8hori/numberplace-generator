/** Internal type */
export type Position = { x: number; y: number };

export const createPositions = (range: number[]): Position[] =>
  range.flatMap((y) => range.map((x) => ({ x, y })));
