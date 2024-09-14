import { pipe, range } from 'remeda';

/** Internal type */
export type BlockSize = {
  width: number;
  height: number;
};

/** BlockSize から、そのゲームの幅及び高さを求める。 */
export const calcSideLength = (blocksize: BlockSize): number =>
  blocksize.height * blocksize.width;

/** BlockSize から、そのゲームの座標や答えなどの取りうる値の集合を生成する。 */
export const createGameRange = (blocksize: BlockSize | number): number[] =>
  typeof blocksize === 'number'
    ? range(0, blocksize)
    : pipe(blocksize, calcSideLength, range)(0);
