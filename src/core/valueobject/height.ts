import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

/**
 * GameBoard全体の縦幅
 */
export type Height = number;

export const createHeight = (baseHeight: BaseHeight, baseWidth: BaseWidth): Height => {
  return baseHeight.value * baseWidth.value;
};

export const validateHeight = (
  baseHeight: number,
  baseWidth: number,
): boolean | string => {
  const oneSideLength = baseHeight * baseWidth;
  return Number.isNaN(oneSideLength)
    ? 'Please chose base-height and base-width.'
    : oneSideLength < 10
    ? true
    : 'Please chose smaller size.';
};
