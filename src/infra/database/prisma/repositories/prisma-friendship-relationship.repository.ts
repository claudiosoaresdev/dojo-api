import { Injectable } from '@nestjs/common';
import { FriendshipRelationship } from 'src/domain/users/enterprise/entities/friendship-relationship';

import { FriendshipRelationshipsRepository } from 'src/domain/users/application/repositories/friendship-relationship.repository';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';
import { PrismaFriendshipRelationshipMapper } from 'src/infra/database/prisma/mappers/prisma-friendship-relationship.mapper';

@Injectable()
export class PrismaFriendshipRelationshipsRepositoryImpl
  implements FriendshipRelationshipsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    friendshipRelationship: FriendshipRelationship,
  ): Promise<FriendshipRelationship> {
    const data = PrismaFriendshipRelationshipMapper.toPrisma(
      friendshipRelationship,
    );
    const createdRelationship =
      await this.prismaService.friendshipRelationship.create({
        data,
        include: { initiator: true, acceptor: true },
      });

    return PrismaFriendshipRelationshipMapper.toDomain(createdRelationship);
  }

  public async delete(initiatorId: string, acceptorId: string): Promise<void> {
    await this.prismaService.friendshipRelationship.delete({
      where: {
        initiatorId_acceptorId: {
          initiatorId,
          acceptorId,
        },
      },
    });
  }

  public async findByInitiatorIdAndAcceptorId(
    initiatorId: string,
    acceptorId: string,
  ): Promise<FriendshipRelationship> {
    const relationship =
      await this.prismaService.friendshipRelationship.findUnique({
        where: {
          initiatorId_acceptorId: {
            initiatorId,
            acceptorId,
          },
        },
        include: { initiator: true, acceptor: true },
      });

    if (!relationship) {
      return null;
    }

    return PrismaFriendshipRelationshipMapper.toDomain(relationship);
  }
}
