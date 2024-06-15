import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

import { Encrypter } from 'src/domain/auth/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  public async encrypt(
    payload: Record<string, unknown>,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  public async decrypt<T>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    return this.jwtService.verifyAsync(token, options) as T;
  }
}
