import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

/**
 * GameBoard全体の縦幅
 */
export type Height = number;

export const createHeight = (
  baseHeight: BaseHeight,
  baseWidth: BaseWidth,
): Height => {
  return baseHeight.value * baseWidth.value;
};
