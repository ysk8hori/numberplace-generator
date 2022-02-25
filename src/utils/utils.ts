export default class Utils {
  public static createArray(count: number): number[] {
    return [...Array(count)].map((value, index) => index);
  }
  public static shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; 0 < i; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  }
  public static round(number: number, precision = 0) {
    const shift = (
      number: number,
      precision: number,
      reverseShift: boolean
    ) => {
      if (reverseShift) {
        precision = -precision;
      }
      const numArray = ('' + number).split('e');
      return +(
        numArray[0] +
        'e' +
        (numArray[1] ? +numArray[1] + precision : precision)
      );
    };
    return shift(Math.round(shift(number, precision, false)), precision, true);
  }

  public static degreeToRadian(degree: number): number {
    return degree * (Math.PI / 180);
  }
}
