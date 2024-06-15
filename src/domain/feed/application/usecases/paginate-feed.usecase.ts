import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { FollowerRelationshipsRepository } from 'src/domain/users/application/repositories/follower-relationships.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';

export enum SortOrder {
  RECENT = 'RECENT',
  RELEVANT = 'RELEVANT',
}

interface PaginatePostsUseCaseRequest {
  userId: string;
  page: number;
  limit: number;
  sortOrder: SortOrder;
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
    sortOrder = SortOrder.RECENT,
  }: PaginatePostsUseCaseRequest): Promise<PaginatePostsUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    const followingRelationships =
      await this.followerRelationshipsRepository.findAllUsersFollowedByUserId(
        userExists.id.toValue(),
      );

    const followingIds = followingRelationships.map((rel) =>
      rel.followingId.toValue(),
    );

    const { data, totalCount } = await this.postsRepository.paginateByUserIds({
      followingIds,
      page,
      limit,
      sortOrder,
    });

    return right({
      data,
      totalCount,
    });
  }
}
