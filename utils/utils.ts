export const throwError: (msg: string) => never = (msg) => {
  throw new Error(msg);
};
