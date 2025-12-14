import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';

/**
 * GameBoard全体の横幅
 */
export type Width = number;

export const createWidth = (baseHeight: BaseHeight, baseWidth: BaseWidth): Width => {
  return baseHeight.value * baseWidth.value;
};
