import { Post as PrismaPost, Prisma } from '@prisma/client';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { Post, MediaType } from 'src/domain/feed/enterprise/entities/post';

export class PrismaPostMapper {
  static toDomain(raw: PrismaPost): Post {
    return Post.create(
      {
        content: raw.content,
        mediaUrl: raw.mediaUrl || undefined,
        mediaType: MediaType[raw.mediaType],
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt || undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      id: post.id.toString(),
      content: post.content,
      mediaUrl: post.mediaUrl || undefined,
      mediaType: post.mediaType || undefined,
      authorId: post.authorId.toString(),
    };
  }
}
