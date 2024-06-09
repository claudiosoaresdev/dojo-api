import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';

export abstract class PostsRepository {
  abstract paginate(
    params: PaginationParams,
  ): Promise<PaginationResponse<Post>>;
  abstract paginateRecent(
    params: PaginationParams,
  ): Promise<PaginationResponse<Post>>;
  abstract findById(id: string): Promise<Post | null>;
  abstract create(post: Post): Promise<Post>;
  abstract update(post: Post): Promise<Post>;
  abstract delete(post: Post): Promise<void>;
}
