import { Encrypter } from 'src/domain/auth/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async decrypt<T>(token: string): Promise<T> {
    try {
      const decoded = JSON.parse(token);

      return decoded as T;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
