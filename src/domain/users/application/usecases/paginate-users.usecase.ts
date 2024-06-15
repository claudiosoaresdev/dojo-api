import { Injectable } from '@nestjs/common';

import { Either, right } from 'src/core/either';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';

interface PaginateUsersUseCaseRequest {
  page: number;
  limit: number;
}

type PaginateUsersUseCaseResponse = Either<null, PaginationResponse<User>>;

@Injectable()
export class PaginateUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({
    page,
    limit,
  }: PaginateUsersUseCaseRequest): Promise<PaginateUsersUseCaseResponse> {
    const { data, totalCount } = await this.usersRepository.paginate({
      page,
      limit,
    });

    return right({
      data,
      totalCount,
    });
  }
}
