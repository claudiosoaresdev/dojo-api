import { Module } from '@nestjs/common';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';

import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { PrismaUsersRepositoryImpl } from 'src/infra/database/prisma/repositories/prisma-users.repository';

import { FollowerRelationshipsRepository } from 'src/domain/users/application/repositories/follower-relationships.repository';
import { PrismaFollowerRelationshipsRepositoryImpl } from 'src/infra/database/prisma/repositories/prisma-follower-relationships.repository';

import { FriendshipRelationshipsRepository } from 'src/domain/users/application/repositories/friendship-relationship.repository';
import { PrismaFriendshipRelationshipRepositoryImpl } from 'src/infra/database/prisma/repositories/prisma-friendship-relationship.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepositoryImpl,
    },
    {
      provide: FollowerRelationshipsRepository,
      useClass: PrismaFollowerRelationshipsRepositoryImpl,
    },
    {
      provide: FriendshipRelationshipsRepository,
      useClass: PrismaFriendshipRelationshipRepositoryImpl,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    FollowerRelationshipsRepository,
    FriendshipRelationshipsRepository,
  ],
})
export class DatabaseModule {}
