import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { FollowerRelationshipsRepository } from 'src/domain/feed/application/repositories/follower-relationships.repository';
import { FollowRelationshipNotFoundError } from 'src/domain/feed/application/usecases/errors/follow-relationship-not-found.error';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { FriendshipRelationshipsRepository } from 'src/domain/feed/application/repositories/friendship-relationship.repository';

interface UnfollowUserUseCaseRequest {
  followerId: string;
  followingId: string;
}

type UnfollowUserUseCaseResponse = Either<
  UserNotFoundError | FollowRelationshipNotFoundError,
  {
    unfollowed: boolean;
  }
>;

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly followerRelationshipsRepository: FollowerRelationshipsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly friendshipRelationshipsRepository: FriendshipRelationshipsRepository,
  ) {}

  public async execute({
    followerId,
    followingId,
  }: UnfollowUserUseCaseRequest): Promise<UnfollowUserUseCaseResponse> {
    const followerExists = await this.usersRepository.findById(followerId);
    const followingExists = await this.usersRepository.findById(followingId);

    if (!followerExists || !followingExists) {
      return left(new UserNotFoundError());
    }

    const follow =
      await this.followerRelationshipsRepository.findByFollowerIdAndFollowingId(
        followerExists.id.toValue(),
        followingExists.id.toValue(),
      );

    if (!follow) {
      return left(new FollowRelationshipNotFoundError());
    }

    await this.followerRelationshipsRepository.delete(followerId, followingId);

    const reciprocalFollow =
      await this.followerRelationshipsRepository.findByFollowerIdAndFollowingId(
        followingExists.id.toValue(),
        followerExists.id.toValue(),
      );

    if (reciprocalFollow) {
      await this.friendshipRelationshipsRepository.delete(
        followerExists.id.toValue(),
        followingExists.id.toValue(),
      );
      await this.friendshipRelationshipsRepository.delete(
        followingExists.id.toValue(),
        followerExists.id.toValue(),
      );
    }

    return right({
      unfollowed: true,
    });
  }
}
