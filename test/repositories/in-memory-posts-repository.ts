import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import {
  PaginatePostsParams,
  PaginatePostsByUserIdsParams,
  PostsRepository,
} from 'src/domain/feed/application/repositories/posts.repository';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export class InMemoryPostsRepository implements PostsRepository {
  public items: Post[] = [];

  public async paginate({
    userId,
    page,
    limit,
  }: PaginatePostsParams): Promise<PaginationResponse<Post>> {
    const start = (page - 1) * limit;
    const end = start + limit;

    const posts = this.items
      .filter((rel) => rel.authorId.equals(new UniqueEntityID(userId)))
      .slice(start, end);

    return {
      data: posts,
      totalCount: this.items.length,
    };
  }

  public async paginateByUserIds({
    followingIds,
    page,
    limit,
    sortOrder,
  }: PaginatePostsByUserIdsParams): Promise<PaginationResponse<Post>> {
    const start = (page - 1) * limit;
    const end = start + limit;

    let posts = this.items.filter((post) =>
      followingIds.includes(post.authorId.toValue()),
    );

    if (sortOrder === 'RECENT') {
      posts = posts.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    } else if (sortOrder === 'RELEVANT') {
      // Espaço reservado para lógica de classificação por relevância
      // Por enquanto, podemos classificar porcreateAt como espaço reservado
      posts = posts.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    const paginatedPosts = posts.slice(start, end);

    return {
      data: paginatedPosts,
      totalCount: posts.length,
    };
  }

  public async findById(id: string): Promise<Post> {
    const post = this.items.find((item) => item.id.toString() === id);

    if (!post) {
      return null;
    }

    return post;
  }

  public async create(post: Post): Promise<Post> {
    this.items.push(post);

    return post;
  }

  public async update(post: Post): Promise<Post> {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items[itemIndex] = post;

    return this.items[itemIndex];
  }

  public async delete(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items.splice(itemIndex, 1);
  }
}
