import type { Position } from "./position.ts";

/** Internal type */
export type Group = string;

export const getHorizontalGroup: (pos: Position) => Group = (pos) =>
  `h${pos.x}`;
export const getVerticalGroup: (pos: Position) => Group = (pos) => `v${pos.y}`;
