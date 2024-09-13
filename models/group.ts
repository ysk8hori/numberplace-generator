import type { Position } from "./position.ts";

/** Internal type */
export type Group = string;

export const getHorizontalGroup: (pos: Position) => Group = (pos) =>
  `h${pos[1]}`;
export const getVerticalGroup: (pos: Position) => Group = (pos) => `v${pos[0]}`;
