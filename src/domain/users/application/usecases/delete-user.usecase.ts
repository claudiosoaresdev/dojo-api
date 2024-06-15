import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';

interface DeleteUserUseCaseRequest {
  userId: string;
}

type DeleteUserUseCaseResponse = Either<UserNotFoundError, null>;

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    await this.usersRepository.delete(userExists);

    return right(null);
  }
}
