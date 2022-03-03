export default class RepositoryError extends Error {
  public name: string = RepositoryError.name;
  public static throw(
    className: string,
    methodName: string,
    message: string,
  ): never {
    throw new RepositoryError(`[${className}#${methodName}]${message}`);
  }
  public static throwNoRepository(
    className: string,
    methodName: string,
  ): never {
    this.throw(className, methodName, 'リポジトリが取得できませんでした。');
  }
}
