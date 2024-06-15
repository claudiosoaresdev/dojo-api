import { Module } from '@nestjs/common';

import { HashComparer } from 'src/domain/auth/application/cryptography/hash-comparer';
import { HashGenerator } from 'src/domain/auth/application/cryptography/hash-generator';
import { Encrypter } from 'src/domain/auth/application/cryptography/encrypter';

import { BcryptHasher } from 'src/infra/cryptography/hashers/bcrypt-hasher';
import { JwtEncrypter } from 'src/infra/cryptography/encrypters/jwt-encrypter';

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
