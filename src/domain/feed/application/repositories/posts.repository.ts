import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { Post } from 'src/domain/feed/enterprise/entities/post';

export type SortOrder = 'RECENT' | 'RELEVANT';

export interface PaginatePostsParams extends PaginationParams {
  userId: string;
}

export interface PaginatePostsByUserIdsParams extends PaginationParams {
  followingIds: string[];
  sortOrder: SortOrder;
}

export abstract class PostsRepository {
  abstract paginate(
    params: PaginatePostsParams,
  ): Promise<PaginationResponse<Post>>;
  abstract paginateByUserIds(
    params: PaginatePostsByUserIdsParams,
  ): Promise<PaginationResponse<Post>>;
  abstract findById(id: string): Promise<Post | null>;
  abstract create(post: Post): Promise<Post>;
  abstract update(post: Post): Promise<Post>;
  abstract delete(post: Post): Promise<void>;
}
