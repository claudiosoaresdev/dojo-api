import { FriendshipRelationship } from 'src/domain/users/enterprise/entities/friendship-relationship';
import { FriendshipRelationshipsRepository } from 'src/domain/users/application/repositories/friendship-relationship.repository';

export class InMemoryFriendshipRelationshipsRepository
  implements FriendshipRelationshipsRepository
{
  public items: FriendshipRelationship[] = [];

  public async create(
    friendshipRelationship: FriendshipRelationship,
  ): Promise<FriendshipRelationship> {
    this.items.push(friendshipRelationship);

    return friendshipRelationship;
  }

  public async delete(initiatorId: string, acceptorId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.initiatorId.toValue() === initiatorId &&
        item.acceptorId.toValue() === acceptorId,
    );

    this.items.splice(itemIndex, 1);
  }

  public async findByInitiatorIdAndAcceptorId(
    initiatorId: string,
    acceptorId: string,
  ): Promise<FriendshipRelationship> {
    const friendshipRelationship = this.items.find(
      (item) =>
        item.initiatorId.toString() === initiatorId &&
        item.acceptorId.toString() === acceptorId,
    );

    if (!friendshipRelationship) {
      return null;
    }

    return friendshipRelationship;
  }
}
