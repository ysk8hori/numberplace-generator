import { Group } from "./group.ts";
import type { Position } from "./position.ts";

export type Cell = {
  pos: Position;
  answer: undefined | number;
  answerCnadidates: number[];
  groups: Group[];
};
