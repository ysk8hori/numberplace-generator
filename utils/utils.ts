export const throwError: (msg: string) => never = (msg) => {
  throw new Error(msg);
};

export const branch: <T, R1, R2, R3>(
  f1: (t: T) => R1,
  f2: (t: T) => R2,
  f3: (r1: R1, r2: R2) => R3,
) => (t: T) => R3 = (f1, f2, f3) => (t) => f3(f1(t), f2(t));
