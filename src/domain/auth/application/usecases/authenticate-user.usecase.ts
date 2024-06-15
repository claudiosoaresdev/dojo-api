import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { HashComparer } from 'src/domain/auth/application/cryptography/hash-comparer';
import { Encrypter } from 'src/domain/auth/application/cryptography/encrypter';
import { EmailAndOrPassowrdInvalidError } from 'src/domain/auth/application/usecases/errors/email-and-or-password-invalid.error';
import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  EmailAndOrPassowrdInvalidError,
  {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || !user.password) {
      return left(new EmailAndOrPassowrdInvalidError());
    }

    const isPassowordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPassowordValid) {
      return left(new EmailAndOrPassowrdInvalidError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      user,
      accessToken,
    });
  }
}
