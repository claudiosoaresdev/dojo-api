import { Prisma, User as PrismaUser } from '@prisma/client';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { User } from 'src/domain/users/enterprise/entities/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        bio: raw.bio || undefined,
        coverPhotoUrl: raw.coverPhotoUrl || undefined,
        profilePictureUrl: raw.profilePictureUrl || undefined,
        email: raw.email,
        isEmailVerified: raw.isEmailVerified || false,
        password: raw.password || undefined,
        followersCount: raw.followersCount,
        followingCount: raw.followingCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      coverPhotoUrl: user.coverPhotoUrl,
      profilePictureUrl: user.profilePictureUrl,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      password: user.password,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    };
  }
}
