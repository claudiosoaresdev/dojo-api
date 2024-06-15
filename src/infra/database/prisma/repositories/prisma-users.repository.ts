import { Injectable } from '@nestjs/common';

import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { User } from 'src/domain/users/enterprise/entities/user';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';
import { PrismaUserMapper } from 'src/infra/database/prisma/mappers/prisma-user.mapper';

@Injectable()
export class PrismaUsersRepositoryImpl implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate({
    page,
    limit,
  }: PaginationParams): Promise<PaginationResponse<User>> {
    const itemsPerPage = Math.max(Math.min(limit, 100), 1);
    const currentPage = Math.max(page, 1);

    const skip = (currentPage - 1) * itemsPerPage;

    const users = await this.prismaService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: itemsPerPage,
    });

    const totalCount = await this.prismaService.user.count();

    return {
      data: users.map((user) => PrismaUserMapper.toDomain(user)),
      totalCount,
    };
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  public async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);

    const raw = await this.prismaService.user.create({
      data,
    });

    return PrismaUserMapper.toDomain(raw);
  }

  public async update(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);

    const raw = await this.prismaService.user.update({
      where: {
        id: data.id,
      },
      data,
    });

    return PrismaUserMapper.toDomain(raw);
  }

  public async updateFollowersCount(
    user: User,
    increment: number,
  ): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prismaService.user.update({
      where: {
        id: data.id,
      },
      data: {
        followersCount: data.followersCount + increment,
      },
    });
  }

  public async delete(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prismaService.user.delete({
      where: {
        id: data.id,
      },
    });
  }
}
