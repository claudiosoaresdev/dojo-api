import { PaginationParams } from 'src/core/repositories/pagination-params';
import { PaginationResponse } from 'src/core/repositories/pagination-response';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { User } from 'src/domain/users/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  public async paginate({
    page,
    limit,
  }: PaginationParams): Promise<PaginationResponse<User>> {
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: this.items.slice(start, end),
      totalCount: this.items.length,
    };
  }

  public async findById(id: string): Promise<User> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  public async create(user: User): Promise<User> {
    this.items.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items[itemIndex] = user;

    return this.items[itemIndex];
  }

  public async updateFollowersCount(
    userId: string,
    increment: number,
  ): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === userId,
    );

    this.items[itemIndex].followersCount += increment;
  }

  public async delete(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIndex, 1);
  }
}
