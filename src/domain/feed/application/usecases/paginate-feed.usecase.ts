import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { FollowerRelationshipsRepository } from '../repositories/follower-relationships.repository';

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
export class PaginateFeedUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly followerRelationshipsRepository: FollowerRelationshipsRepository,
    private readonly postsRepository: PostsRepository,
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

    const followingRelationships =
      await this.followerRelationshipsRepository.findAllUsersFollowedByUserId(
        userId,
      );

    const followingIds = followingRelationships.map((rel) =>
      rel.followingId.toValue(),
    );

    const { data, totalCount } = await this.postsRepository.paginateByUserIds({
      followingIds,
      page,
      limit,
      sortOrder: 'RECENT',
    });

    return right({
      data,
      totalCount,
    });
  }
}
