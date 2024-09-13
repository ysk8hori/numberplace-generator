/** Internal type */
export type Position = Readonly<[number, number]>;

export const createPositions: (range: number[]) => Position[] = (range) =>
  range.flatMap((y) => range.map((x) => [x, y]));

export const isSamePos: (a: Position, b: Position) => boolean = (a, b) =>
  a[0] === b[0] && a[1] === b[1];
