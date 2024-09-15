import { isNonNullish } from 'remeda';
import type { BlockSize } from './blockSize.ts';
import type { GameType } from './game.ts';
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

export const getHyperGroup: (
  blockSize: BlockSize,
) => (pos: Position) => Group = (b) => (p) =>
  `h${Math.floor(p[0] / b.width)}${Math.floor(p[1] / b.height)}`;

  /** 盤面の左上から右下への対角線のグループ */
export const getTLBRGroup: (pos: Position) => Group | undefined = (p) =>
  p[0] === p[1] ? 'TLBR' : undefined;

  /** 盤面の左上から右下への対角線のグループ */
export const getTRBLGroup:  (
  blockSize: BlockSize,
) => (pos: Position) => Group | undefined =  (b) => (p) =>
  (p[0] + p[1]) === (b.height + b.width) ? 'TRBL' : undefined;

export const getGroups: (
  blockSize: BlockSize,
) => (gameType: GameType) => (pos: Position) => Group[] = (
  b,
) =>
(gameType) =>
(p) =>
  gameType === 'hypercross'
    ? [
      getVerticalGroup(p),
      getHorizontalGroup(p),
      getBlockGroup(b)(p),
      getHyperGroup(b)(p),
      getTLBRGroup(p),
    ].filter(isNonNullish)
    : gameType === 'hyper'
    ? [
      getVerticalGroup(p),
      getHorizontalGroup(p),
      getBlockGroup(b)(p),
      getHyperGroup(b)(p),
    ]
    : gameType === 'cross'
    ? [
      getVerticalGroup(p),
      getHorizontalGroup(p),
      getBlockGroup(b)(p),
      getTLBRGroup(p),
    ].filter(isNonNullish)
    : [getVerticalGroup(p), getHorizontalGroup(p), getBlockGroup(b)(p)];
