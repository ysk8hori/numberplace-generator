export default class BusinessError extends Error {
  public readonly name: string = 'BusinessError';
  public static throw(
    className: string,
    methodName: string,
    message: string,
  ): never {
    throw new BusinessError(`[${className}#${methodName}]${message}`);
  }
}
