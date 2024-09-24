import { isNonNullish } from 'remeda';
import type { BlockSize } from './blockSize.ts';
import type { GameType } from './game.ts';
import { isSamePos, type Position } from './position.ts';

/** Internal type */
export type Group = string;

export const getHorizontalGroup: (pos: Position) => Group = (pos) =>
  `h${pos[1]}`;
export const getVerticalGroup: (pos: Position) => Group = (pos) => `v${pos[0]}`;

export const getBlockGroup: (
  blockSize: BlockSize,
) => (pos: Position) => Group = (b) => (p) =>
  `b${Math.floor(p[0] / b.width)}${Math.floor(p[1] / b.height)}`;

/** 盤面の左上から右下への対角線のグループ */
export const getTLBRGroup: (pos: Position) => Group | undefined = (p) =>
  p[0] === p[1] ? 'TLBR' : undefined;

/** 盤面の左上から右下への対角線のグループ */
export const getTRBLGroup: (
  blockSize: BlockSize,
) => (pos: Position) => Group | undefined = (b) => (p) =>
  (p[0] + p[1]) === (b.height + b.width) ? 'TRBL' : undefined;

const HYPER1_GROUP_POSITIONS: Position[] = [
  [1, 1],
  [2, 1],
  [3, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [1, 3],
  [2, 3],
  [3, 3],
];
const HYPER2_GROUP_POSITIONS: Position[] = [
  [5, 1],
  [6, 1],
  [7, 1],
  [5, 2],
  [6, 2],
  [7, 2],
  [5, 3],
  [6, 3],
  [7, 3],
];
const HYPER3_GROUP_POSITIONS: Position[] = [
  [1, 5],
  [2, 5],
  [3, 5],
  [1, 6],
  [2, 6],
  [3, 6],
  [1, 7],
  [2, 7],
  [3, 7],
];
const HYPER4_GROUP_POSITIONS: Position[] = [
  [5, 5],
  [6, 5],
  [7, 5],
  [5, 6],
  [6, 6],
  [7, 6],
  [5, 7],
  [6, 7],
  [7, 7],
];

export const getHyper1Group: (pos: Position) => Group | undefined = (p) =>
  HYPER1_GROUP_POSITIONS.some(isSamePos(p)) ? 'hyper1' : undefined;
export const getHyper2Group: (pos: Position) => Group | undefined = (p) =>
  HYPER2_GROUP_POSITIONS.some(isSamePos(p)) ? 'hyper2' : undefined;
export const getHyper3Group: (pos: Position) => Group | undefined = (p) =>
  HYPER3_GROUP_POSITIONS.some(isSamePos(p)) ? 'hyper3' : undefined;
export const getHyper4Group: (pos: Position) => Group | undefined = (p) =>
  HYPER4_GROUP_POSITIONS.some(isSamePos(p)) ? 'hyper4' : undefined;

export const getHyperGroup: (pos: Position) => Group | undefined = (p) =>
  getHyper1Group(p) ??
    getHyper2Group(p) ??
    getHyper3Group(p) ??
    getHyper4Group(p);

export const getGroups: (
  blockSize: BlockSize,
) => (gameTypes: GameType[]) => (pos: Position) => Group[] = (
  b,
) =>
(gameTypes) =>
(p) =>
  [
    getVerticalGroup(p),
    getHorizontalGroup(p),
    getBlockGroup(b)(p),
    gameTypes.includes('hyper') ? getHyperGroup(p) : undefined,
    gameTypes.includes('cross') ? getTLBRGroup(p) : undefined,
    gameTypes.includes('cross') ? getTRBLGroup(b)(p) : undefined,
  ].filter(isNonNullish);
