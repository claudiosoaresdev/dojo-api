import { Prisma } from '@prisma/client';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { User } from 'src/domain/users/enterprise/entities/user';
import { FriendshipRelationship } from 'src/domain/users/enterprise/entities/friendship-relationship';

export class PrismaFriendshipRelationshipMapper {
  static toDomain(
    raw: Prisma.FriendshipRelationshipGetPayload<{
      include: {
        initiator: true;
        acceptor: true;
      };
    }>,
  ): FriendshipRelationship {
    return FriendshipRelationship.create(
      {
        initiatorId: new UniqueEntityID(raw.initiatorId),
        initiator: User.create(
          {
            firstName: raw.initiator.firstName,
            lastName: raw.initiator.lastName,
            bio: raw.initiator.bio,
            profilePictureUrl: raw.initiator.profilePictureUrl,
            coverPhotoUrl: raw.initiator.coverPhotoUrl,
            email: raw.initiator.email,
            isEmailVerified: raw.initiator.isEmailVerified,
            followersCount: raw.initiator.followersCount,
            followingCount: raw.initiator.followingCount,
            createdAt: raw.initiator.createdAt,
            updatedAt: raw.initiator.updatedAt,
          },
          new UniqueEntityID(raw.initiatorId),
        ),
        acceptorId: new UniqueEntityID(raw.acceptorId),
        acceptor: User.create(
          {
            firstName: raw.acceptor.firstName,
            lastName: raw.acceptor.lastName,
            bio: raw.acceptor.bio,
            profilePictureUrl: raw.acceptor.profilePictureUrl,
            coverPhotoUrl: raw.acceptor.coverPhotoUrl,
            email: raw.acceptor.email,
            isEmailVerified: raw.acceptor.isEmailVerified,
            followersCount: raw.acceptor.followersCount,
            followingCount: raw.acceptor.followingCount,
            createdAt: raw.acceptor.createdAt,
            updatedAt: raw.acceptor.updatedAt,
          },
          new UniqueEntityID(raw.acceptorId),
        ),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    friendshipRelationship: FriendshipRelationship,
  ): Prisma.FriendshipRelationshipUncheckedCreateInput {
    return {
      id: friendshipRelationship.id.toString(),
      initiatorId: friendshipRelationship.initiatorId.toString(),
      acceptorId: friendshipRelationship.acceptorId.toString(),
    };
  }
}
