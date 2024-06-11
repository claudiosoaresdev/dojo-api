import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';

import { User } from 'src/domain/users/enterprise/entities/user';

export abstract class UsersRepository {
  abstract paginate(
    params: PaginationParams,
  ): Promise<PaginationResponse<User>>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract updateFollowersCount(
    userId: string,
    increment: number,
  ): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
