import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import {
  FriendshipRelationship,
  FriendshipRelationshipProps,
} from 'src/domain/feed/enterprise/entities/friendship-relationship';

export function makeFriendshipRelationship(
  override: Partial<FriendshipRelationshipProps> = {},
  id?: UniqueEntityID,
) {
  const followerRelationship = FriendshipRelationship.create(
    {
      initiatorId: override.initiatorId,
      acceptorId: override.acceptorId,
      ...override,
    },
    id,
  );

  return followerRelationship;
}
