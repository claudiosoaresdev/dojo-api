import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserAlreadyExistsError } from 'src/domain/users/application/usecases/errors/user-already-exists.error';

interface CreateUserUseCaseRequest {
  displayName: string;
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
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({
    displayName,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    const user = User.create({
      displayName,
      email,
      password,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
