import { FollowerRelationship } from 'src/domain/feed/enterprise/entities/follower-relationship';

export abstract class FollowerRelationshipsRepository {
  abstract findAllUsersFollowedByUserId(
    userId: string,
  ): Promise<FollowerRelationship[]>;
  abstract findByFollowerIdAndFollowingId(
    followerId: string,
    followingId: string,
  ): Promise<FollowerRelationship | null>;
  abstract create(follow: FollowerRelationship): Promise<FollowerRelationship>;
  abstract delete(followerId: string, followingId: string): Promise<void>;
}
