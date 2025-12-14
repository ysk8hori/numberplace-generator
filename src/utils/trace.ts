/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * トレースログを出力する。ログの内容は以下。
 * - クラス名
 * - メソッド名
 * - 引数(メソッド開始時のみ)
 * - 返却値(メソッド終了時のみ)
 */
export const Trace = (
  target: any,
  props: string,
  descriptor: PropertyDescriptor,
) => {
  const delegate = descriptor.value;
  descriptor.value = function () {
    const color = getColor();
    const marker = createMarker(target, props, color);
    toTraceStart(marker, arguments);
    const ret = Reflect.apply(delegate, this, arguments);
    toTraceEnd(ret, marker);
    return ret;
  };
};
function toTraceStart(marker: string, args: IArguments) {
  console.log(createStartingLog(marker, args));
}

function toTraceEnd(ret: any, marker: string) {
  if (ret instanceof Promise) {
    ret.then(returnValue => {
      console.log(createEndingLog(marker, returnValue));
    });
  } else {
    console.log(createEndingLog(marker, ret));
  }
}

function createMarker(target: any, props: string, color: Color) {
  return `${color} ${target.constructor.name}#${props}${Color.reset}`;
}

function createEndingLog(marker: string, ret: any): any {
  return `[ END ] ${marker} \n${ret ? JSON.stringify(ret, null, '  ') : ''}`;
}

function createStartingLog(marker: string, arg: IArguments): any {
  return `[START] ${marker} \n${arg ? JSON.stringify(arg, null, '  ') : ''}`;
}

enum Color {
  red = '\u001b[31m',
  green = '\u001b[32m',
  blue = '\u001b[34m',
  magenta = '\u001b[35m',
  cyan = '\u001b[36m',
  reset = '\u001b[0m',
}
/** コンソールログの色を順繰り変更するために使用する、色の配列の定義 */
const colors = [Color.red, Color.green, Color.blue, Color.magenta];
/** コンソールログの色のインデックス */
let colorIndex = 0;
function getColor(): Color {
  return colors[getColorIndex()];
  /** 色のインデックスを取得する。インデックスは取得のたびに変更する。 */
  function getColorIndex() {
    return ++colorIndex === colors.length ? (colorIndex = 0) : colorIndex;
  }
}
