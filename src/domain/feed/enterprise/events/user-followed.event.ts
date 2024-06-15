import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { DomainEvent } from 'src/core/events/domain-event';

import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';

export class UserFollowedEvent implements DomainEvent {
  public ocurredAt: Date;
  public followerRelationship: FollowerRelationship;

  constructor(followerRelationship: FollowerRelationship) {
    this.followerRelationship = followerRelationship;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.followerRelationship.id;
  }
}
