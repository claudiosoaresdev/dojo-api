import { Injectable } from '@nestjs/common';
import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';

import { DomainEvents } from 'src/core/events/domain-events';
import { FollowerRelationshipsRepository } from 'src/domain/users/application/repositories/follower-relationships.repository';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';
import { PrismaFollowerRelationshipMapper } from 'src/infra/database/prisma/mappers/prisma-follower-relationship.mapper';

@Injectable()
export class PrismaFollowerRelationshipsRepositoryImpl
  implements FollowerRelationshipsRepository
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async findAllUsersFollowedByUserId(
    userId: string,
  ): Promise<FollowerRelationship[]> {
    const relationships =
      await this.prismaService.followerRelationship.findMany({
        where: { followerId: userId },
        include: { following: true, follower: true },
      });

    return relationships.map((relationship) =>
      PrismaFollowerRelationshipMapper.toDomain(relationship),
    );
  }

  public async findByFollowerIdAndFollowingId(
    followerId: string,
    followingId: string,
  ): Promise<FollowerRelationship> {
    const relationship =
      await this.prismaService.followerRelationship.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
        include: { following: true, follower: true },
      });

    if (!relationship) {
      return null;
    }

    return PrismaFollowerRelationshipMapper.toDomain(relationship);
  }

  public async create(
    followerRelationship: FollowerRelationship,
  ): Promise<FollowerRelationship> {
    const data =
      PrismaFollowerRelationshipMapper.toPrisma(followerRelationship);

    const [createdRelationship] = await Promise.all([
      this.prismaService.followerRelationship.create({
        data,
        include: { following: true, follower: true },
      }),
      this.usersRepository.updateFollowingCount(
        followerRelationship.follower,
        1,
      ),
      this.usersRepository.updateFollowersCount(
        followerRelationship.following,
        1,
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(followerRelationship.id);

    return PrismaFollowerRelationshipMapper.toDomain(createdRelationship);
  }

  public async delete(
    followerRelationship: FollowerRelationship,
  ): Promise<void> {
    await Promise.all([
      this.prismaService.followerRelationship.delete({
        where: {
          followerId_followingId: {
            followerId: followerRelationship.followerId.toValue(),
            followingId: followerRelationship.followingId.toValue(),
          },
        },
      }),
      this.usersRepository.updateFollowingCount(
        followerRelationship.follower,
        -1,
      ),
      this.usersRepository.updateFollowersCount(
        followerRelationship.following,
        -1,
      ),
    ]);
  }
}
