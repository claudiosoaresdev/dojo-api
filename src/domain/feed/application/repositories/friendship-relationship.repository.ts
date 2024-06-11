import { FriendshipRelationship } from 'src/domain/feed/enterprise/entities/friendship-relationship';

export abstract class FriendshipRelationshipsRepository {
  abstract create(
    friendshipRelationship: FriendshipRelationship,
  ): Promise<FriendshipRelationship>;
  abstract delete(initiatorId: string, acceptorId: string): Promise<void>;
  abstract findByInitiatorIdAndAcceptorId(
    initiatorId: string,
    acceptorId: string,
  ): Promise<FriendshipRelationship | null>;
}
