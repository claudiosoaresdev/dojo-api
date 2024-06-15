import { FollowerRelationship } from 'src/domain/feed/enterprise/entities/follower-relationship';
import { FollowerRelationshipsRepository } from 'src/domain/feed/application/repositories/follower-relationships.repository';

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DomainEvents } from 'src/core/events/domain-events';

export class InMemoryFollowerRelationshipsRepository
  implements FollowerRelationshipsRepository
{
  constructor(private readonly usersRepository: InMemoryUsersRepository) {}

  public items: FollowerRelationship[] = [];

  public async findAllUsersFollowedByUserId(
    userId: string,
  ): Promise<FollowerRelationship[]> {
    return this.items.filter((rel) => rel.followerId.toValue() === userId);
  }

  public async findByFollowerIdAndFollowingId(
    followerId: string,
    followingId: string,
  ): Promise<FollowerRelationship> {
    const followerRelationship = this.items.find(
      (item) =>
        item.followerId.toString() === followerId &&
        item.followingId.toString() === followingId,
    );

    if (!followerRelationship) {
      return null;
    }

    return followerRelationship;
  }

  public async create(
    followerRelationship: FollowerRelationship,
  ): Promise<FollowerRelationship> {
    this.items.push(followerRelationship);

    await this.usersRepository.updateFollowersCount(
      followerRelationship.following,
      1,
    );

    DomainEvents.dispatchEventsForAggregate(followerRelationship.id);

    return followerRelationship;
  }

  public async delete(followerId: string, followingId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.followerId.toValue() === followerId &&
        item.followingId.toValue() === followingId,
    );

    const following = this.items[itemIndex].following;

    this.items.splice(itemIndex, 1);

    await this.usersRepository.updateFollowersCount(following, -1);
  }
}
