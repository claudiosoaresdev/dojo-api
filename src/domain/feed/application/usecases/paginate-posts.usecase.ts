import { Injectable } from '@nestjs/common';

import { Either, right } from 'src/core/either';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';

interface PaginatePostsUseCaseRequest {
  page: number;
  limit: number;
}

type PaginatePostsUseCaseResponse = Either<null, PaginationResponse<Post>>;

@Injectable()
export class PaginatePostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({
    page,
    limit,
  }: PaginatePostsUseCaseRequest): Promise<PaginatePostsUseCaseResponse> {
    const { data, totalCount } = await this.postsRepository.paginate({
      page,
      limit,
    });

    return right({
      data,
      totalCount,
    });
  }
}
