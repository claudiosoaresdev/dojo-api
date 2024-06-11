import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import {
  FollowerRelationship,
  FollowerRelationshipProps,
} from 'src/domain/feed/enterprise/entities/follower-relationship';

export function makeFollowerRelationship(
  override: Partial<FollowerRelationshipProps> = {},
  id?: UniqueEntityID,
) {
  const followerRelationship = FollowerRelationship.create(
    {
      followerId: override.followerId,
      followingId: override.followingId,
      ...override,
    },
    id,
  );

  return followerRelationship;
}
