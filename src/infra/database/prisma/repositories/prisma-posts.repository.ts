import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationResponse } from 'src/core/repositories/pagination-response';

import {
  PaginatePostsByUserIdsParams,
  PaginatePostsParams,
  PostsRepository,
} from 'src/domain/feed/application/repositories/posts.repository';
import { Post } from 'src/domain/feed/enterprise/entities/post';

import { PrismaService } from 'src/infra/database/prisma/services/prisma.service';
import { PrismaPostMapper } from 'src/infra/database/prisma/mappers/prisma-post.mapper';

@Injectable()
export class PrismaPostsRepositoryImpl implements PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate({
    page,
    limit,
    userId,
  }: PaginatePostsParams): Promise<PaginationResponse<Post>> {
    const skip = (page - 1) * limit;

    const posts = await this.prismaService.post.findMany({
      where: { authorId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = await this.prismaService.post.count({
      where: { authorId: userId },
    });

    const domainPosts = posts.map(PrismaPostMapper.toDomain);

    return {
      data: domainPosts,
      totalCount,
    };
  }

  public async paginateByUserIds({
    page,
    limit,
    followingIds,
    sortOrder,
  }: PaginatePostsByUserIdsParams): Promise<PaginationResponse<Post>> {
    const skip = (page - 1) * limit;

    const orderBy =
      sortOrder === 'RECENT'
        ? { createdAt: Prisma.SortOrder.desc }
        : { createdAt: Prisma.SortOrder.desc };

    const posts = await this.prismaService.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
      },
      skip,
      take: limit,
      orderBy,
    });

    const totalCount = await this.prismaService.post.count({
      where: {
        authorId: {
          in: followingIds,
        },
      },
    });

    const domainPosts = posts.map(PrismaPostMapper.toDomain);

    return {
      data: domainPosts,
      totalCount,
    };
  }

  public async findById(id: string): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    return PrismaPostMapper.toDomain(post);
  }

  public async create(post: Post): Promise<Post> {
    const raw = PrismaPostMapper.toPrisma(post);
    const createdPost = await this.prismaService.post.create({
      data: raw,
    });

    return PrismaPostMapper.toDomain(createdPost);
  }

  public async update(post: Post): Promise<Post> {
    const raw = PrismaPostMapper.toPrisma(post);
    const updatedPost = await this.prismaService.post.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaPostMapper.toDomain(updatedPost);
  }

  public async delete(post: Post): Promise<void> {
    await this.prismaService.post.delete({
      where: { id: post.id.toString() },
    });
  }
}
