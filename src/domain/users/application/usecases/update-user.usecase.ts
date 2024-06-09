import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

interface UpdateUserUseCaseRequest {
  userId: string;
  displayName?: string;
  email?: string;
  password?: string;
}

type UpdateUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({
    userId,
    displayName,
    email,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    if (displayName && displayName !== userExists.displayName.toString()) {
      userExists.displayName = displayName;
    }

    if (email && email !== userExists.email.toString()) {
      userExists.email = email;
    }

    if (password) {
      userExists.password = password;
    }

    const updatedUser = await this.usersRepository.update(userExists);

    return right({
      user: updatedUser,
    });
  }
}
