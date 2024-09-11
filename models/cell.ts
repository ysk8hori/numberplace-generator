import { Group } from "./group.ts";
import type { Position } from "./position.ts";

/** Internal type */
export type Cell = {
  pos: Position;
  answer: undefined | number;
  answerCnadidates: number[];
  groups: Group[];
};
