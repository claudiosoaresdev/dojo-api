import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

import { RelationshipProps } from 'src/domain/users/enterprise/entities/relationship';
import { User } from 'src/domain/users/enterprise/entities/user';

export interface FriendshipRelationshipProps extends RelationshipProps {
  initiatorId: UniqueEntityID;
  initiator: User;
  acceptorId: UniqueEntityID;
  acceptor: User;
}

export class FriendshipRelationship extends Entity<FriendshipRelationshipProps> {
  get initiatorId(): UniqueEntityID {
    return this.props.initiatorId;
  }

  get initiator(): User {
    return this.props.initiator;
  }

  get acceptorId(): UniqueEntityID {
    return this.props.acceptorId;
  }

  get acceptor(): User {
    return this.props.acceptor;
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
