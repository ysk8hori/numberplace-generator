export const throwError: (msg: string) => never = (msg) => {
  throw new Error(msg);
};

export const branch: <T, R1, R2>(
  f1: (t: T) => R1,
  f2: (t: T) => R2,
) => (t: T) => [R1, R2] = (f1, f2) => (t) => [f1(t), f2(t)];

export const merge: <T1, T2, R>(f: (t: [T1, T2]) => R) => (t: [T1, T2]) => R =
  (f) => (t) =>
    f(t);
