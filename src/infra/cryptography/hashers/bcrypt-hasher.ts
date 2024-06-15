import { hash, compare } from 'bcrypt';

import { HashComparer } from 'src/domain/auth/application/cryptography/hash-comparer';
import { HashGenerator } from 'src/domain/auth/application/cryptography/hash-generator';

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  public async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  public async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
