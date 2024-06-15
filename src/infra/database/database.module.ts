import { Module } from '@nestjs/common';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';

import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { PrismaUsersRepositoryImpl } from 'src/infra/database/prisma/repositories/prisma-users.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepositoryImpl,
    },
  ],
  exports: [PrismaService, UsersRepository],
})
export class DatabaseModule {}
