import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';

export class InMemoryPostsRepository implements PostsRepository {
  public items: Post[] = [];

  public async paginate({
    page,
    limit,
  }: PaginationParams): Promise<PaginationResponse<Post>> {
    const start = (page - 1) * limit;
    const end = start + limit;

    const posts = this.items.slice(start, end);

    return {
      data: posts,
      totalCount: this.items.length,
    };
  }

  public async paginateRecent({
    page,
    limit,
  }: PaginationParams): Promise<PaginationResponse<Post>> {
    const start = (page - 1) * limit;
    const end = start * limit;

    const posts = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(start, end);

    return {
      data: posts,
      totalCount: this.items.length,
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
