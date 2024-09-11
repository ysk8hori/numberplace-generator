import { Group } from "./group.ts";
import type { Position } from "./position.ts";

/** Internal type */
export type Cell = {
  pos: Position;
  answerMut: undefined | number;
  answerCnadidatesMut: number[];
  groups: Group[];
};
