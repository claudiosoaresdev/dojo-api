import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { UnfollowUserUseCase } from 'src/domain/feed/application/usecases/unfollow-user.usecase';

import { makeUser } from 'test/factories/make-user';
import { makeFollowerRelationship } from 'test/factories/make-follower-relationship';
import { InMemoryFollowerRelationshipsRepository } from 'test/repositories/in-memory-follower-relationships-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryFriendshipRelationshipsRepository } from 'test/repositories/in-memory-friendship-relationships-repository';

let inMemoryFollowerRelationshipsRepository: InMemoryFollowerRelationshipsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFriendshipRelationshipsRepository: InMemoryFriendshipRelationshipsRepository;
let sut: UnfollowUserUseCase;

describe('Unfollow User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowerRelationshipsRepository =
      new InMemoryFollowerRelationshipsRepository(inMemoryUsersRepository);
    inMemoryFriendshipRelationshipsRepository =
      new InMemoryFriendshipRelationshipsRepository();
    sut = new UnfollowUserUseCase(
      inMemoryFollowerRelationshipsRepository,
      inMemoryUsersRepository,
      inMemoryFriendshipRelationshipsRepository,
    );
  });

  it('should be able to unfollow a user', async () => {
    const follower = makeUser({}, new UniqueEntityID('follower-1'));
    const following = makeUser({}, new UniqueEntityID('following-1'));

    inMemoryUsersRepository.items.push(...[follower, following]);

    const followRelationship = makeFollowerRelationship({
      followerId: follower.id,
      follower: follower,
      followingId: following.id,
      following: following,
    });

    inMemoryFollowerRelationshipsRepository.create(followRelationship);

    const result = await sut.execute({
      followerId: follower.id.toValue(),
      followingId: following.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(following.followersCount).toBe(0);
  });
});
