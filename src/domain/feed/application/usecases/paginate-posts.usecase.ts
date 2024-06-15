import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

interface PaginatePostsUseCaseRequest {
  userId: string;
  page: number;
  limit: number;
}

type PaginatePostsUseCaseResponse = Either<
  UserNotFoundError,
  PaginationResponse<Post>
>;

@Injectable()
export class PaginatePostsUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute({
    userId,
    page,
    limit,
  }: PaginatePostsUseCaseRequest): Promise<PaginatePostsUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    const { data, totalCount } = await this.postsRepository.paginate({
      userId,
      page,
      limit,
    });

    return right({
      data,
      totalCount,
    });
  }
}
