import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserAlreadyExistsError } from 'src/domain/users/application/usecases/errors/user-already-exists.error';
import { HashGenerator } from 'src/domain/auth/application/cryptography/hash-generator';

interface CreateUserUseCaseRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  public async execute({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
