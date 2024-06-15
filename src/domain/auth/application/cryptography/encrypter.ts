export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: any,
  ): Promise<string>;
  abstract decrypt<T>(token: string, options?: any): Promise<T>;
}
