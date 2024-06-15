import { Prisma } from '@prisma/client';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { User } from 'src/domain/users/enterprise/entities/user';
import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';

export class PrismaFollowerRelationshipMapper {
  static toDomain(
    raw: Prisma.FollowerRelationshipGetPayload<{
      include: {
        follower: true;
        following: true;
      };
    }>,
  ): FollowerRelationship {
    return FollowerRelationship.create(
      {
        followerId: new UniqueEntityID(raw.followerId),
        follower: User.create(
          {
            firstName: raw.follower.firstName,
            lastName: raw.follower.lastName,
            bio: raw.follower.bio,
            profilePictureUrl: raw.follower.profilePictureUrl,
            coverPhotoUrl: raw.follower.coverPhotoUrl,
            email: raw.follower.email,
            isEmailVerified: raw.follower.isEmailVerified,
            followersCount: raw.follower.followersCount,
            followingCount: raw.follower.followingCount,
            createdAt: raw.follower.createdAt,
            updatedAt: raw.follower.updatedAt,
          },
          new UniqueEntityID(raw.followerId),
        ),
        followingId: new UniqueEntityID(raw.followingId),
        following: User.create(
          {
            firstName: raw.following.firstName,
            lastName: raw.following.lastName,
            bio: raw.following.bio,
            profilePictureUrl: raw.following.profilePictureUrl,
            coverPhotoUrl: raw.following.coverPhotoUrl,
            email: raw.following.email,
            isEmailVerified: raw.following.isEmailVerified,
            followersCount: raw.following.followersCount,
            followingCount: raw.following.followingCount,
            createdAt: raw.following.createdAt,
            updatedAt: raw.following.updatedAt,
          },
          new UniqueEntityID(raw.followingId),
        ),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    followerRelationship: FollowerRelationship,
  ): Prisma.FollowerRelationshipUncheckedCreateInput {
    return {
      id: followerRelationship.id.toString(),
      followerId: followerRelationship.followerId.toString(),
      followingId: followerRelationship.followingId.toString(),
    };
  }
}
