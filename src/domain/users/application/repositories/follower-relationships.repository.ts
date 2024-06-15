import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';

export abstract class FollowerRelationshipsRepository {
  abstract findAllUsersFollowedByUserId(
    userId: string,
  ): Promise<FollowerRelationship[]>;
  abstract findByFollowerIdAndFollowingId(
    followerId: string,
    followingId: string,
  ): Promise<FollowerRelationship | null>;
  abstract create(
    followerRelationship: FollowerRelationship,
  ): Promise<FollowerRelationship>;
  abstract delete(followerRelationship: FollowerRelationship): Promise<void>;
}
