import { AggregateRoot } from 'src/core/entities/aggregate-root';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

import { RelationshipProps } from 'src/domain/feed/enterprise/entities/relationship';
import { UserFollowedEvent } from 'src/domain/feed/enterprise/events/user-followed.event';

export interface FollowerRelationshipProps extends RelationshipProps {
  followerId: UniqueEntityID;
  followingId: UniqueEntityID;
}

export class FollowerRelationship extends AggregateRoot<FollowerRelationshipProps> {
  get followerId(): UniqueEntityID {
    return this.props.followerId;
  }

  get followingId(): UniqueEntityID {
    return this.props.followingId;
  }

  static create(
    props: Optional<FollowerRelationshipProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): FollowerRelationship {
    const followerRelationship = new FollowerRelationship(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewFollower = !id;

    if (isNewFollower) {
      followerRelationship.addDomainEvent(
        new UserFollowedEvent(followerRelationship),
      );
    }

    return followerRelationship;
  }
}
