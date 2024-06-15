import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

interface UpdateUserUseCaseRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
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
    firstName,
    lastName,
    bio,
    email,
    password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    if (firstName && firstName !== userExists.firstName) {
      userExists.firstName = firstName;
    }

    if (lastName && lastName !== userExists.lastName) {
      userExists.lastName = lastName;
    }

    if (bio && bio !== userExists.bio) {
      userExists.bio = bio;
    }

    if (email && email !== userExists.email) {
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
