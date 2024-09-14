import type { BlockSize } from './blockSize.ts';
import type { Position } from './position.ts';

/** Internal type */
export type Group = string;

export const getHorizontalGroup: (pos: Position) => Group = (pos) =>
  `h${pos[1]}`;
export const getVerticalGroup: (pos: Position) => Group = (pos) => `v${pos[0]}`;

export const getBlockGroup: (
  blockSize: BlockSize,
) => (pos: Position) => Group = (b) => (p) =>
  `b${Math.floor(p[0] / b.width)}${Math.floor(p[1] / b.height)}`;
