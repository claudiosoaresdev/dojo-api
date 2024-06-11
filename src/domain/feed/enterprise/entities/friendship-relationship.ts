import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

import { RelationshipProps } from 'src/domain/feed/enterprise/entities/relationship';

export interface FriendshipRelationshipProps extends RelationshipProps {
  initiatorId: UniqueEntityID;
  acceptorId: UniqueEntityID;
}

export class FriendshipRelationship extends Entity<FriendshipRelationshipProps> {
  get initiatorId(): UniqueEntityID {
    return this.props.initiatorId;
  }

  get acceptorId(): UniqueEntityID {
    return this.props.acceptorId;
  }

  static create(
    props: Optional<FriendshipRelationshipProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): FriendshipRelationship {
    const friendshipRelationship = new FriendshipRelationship(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return friendshipRelationship;
  }
}
