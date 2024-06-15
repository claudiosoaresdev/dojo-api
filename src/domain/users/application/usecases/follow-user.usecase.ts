import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';
import { FollowerRelationshipsRepository } from 'src/domain/users/application/repositories/follower-relationships.repository';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { FriendshipRelationship } from 'src/domain/users/enterprise/entities/friendship-relationship';
import { FriendshipRelationshipsRepository } from 'src/domain/users/application/repositories/friendship-relationship.repository';

interface FollowUserUseCaseRequest {
  followerId: string;
  followingId: string;
}

type FollowUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    followed: boolean;
  }
>;

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly followerRelationshipsRepository: FollowerRelationshipsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly friendshipRelationshipsRepository: FriendshipRelationshipsRepository,
  ) {}

  public async execute({
    followerId,
    followingId,
  }: FollowUserUseCaseRequest): Promise<FollowUserUseCaseResponse> {
    const followerExists = await this.usersRepository.findById(followerId);
    const followingExists = await this.usersRepository.findById(followingId);

    if (!followerExists || !followingExists) {
      return left(new UserNotFoundError());
    }

    const followerRelationship = FollowerRelationship.create({
      followerId: followerExists.id,
      follower: followerExists,
      followingId: followingExists.id,
      following: followingExists,
    });

    await this.followerRelationshipsRepository.create(followerRelationship);

    const reciprocalFollow =
      await this.followerRelationshipsRepository.findByFollowerIdAndFollowingId(
        followingExists.id.toValue(),
        followerExists.id.toValue(),
      );

    if (reciprocalFollow) {
      const followerForFriendshipRelationship = FriendshipRelationship.create({
        initiatorId: followerExists.id,
        initiator: followingExists,
        acceptorId: followingExists.id,
        acceptor: followerExists,
      });

      const followingForFriendshipRelationship = FriendshipRelationship.create({
        initiatorId: followingExists.id,
        initiator: followingExists,
        acceptorId: followerExists.id,
        acceptor: followerExists,
      });

      await this.friendshipRelationshipsRepository.create(
        followerForFriendshipRelationship,
      );

      await this.friendshipRelationshipsRepository.create(
        followingForFriendshipRelationship,
      );
    }

    return right({
      followed: true,
    });
  }
}
