import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { FollowUserUseCase } from 'src/domain/users/application/usecases/follow-user.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryFollowerRelationshipsRepository } from 'test/repositories/in-memory-follower-relationships-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryFriendshipRelationshipsRepository } from 'test/repositories/in-memory-friendship-relationships-repository';

let inMemoryFollowerRelationshipsRepository: InMemoryFollowerRelationshipsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFriendshipRelationshipsRepository: InMemoryFriendshipRelationshipsRepository;
let sut: FollowUserUseCase;

describe('Follow User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowerRelationshipsRepository =
      new InMemoryFollowerRelationshipsRepository(inMemoryUsersRepository);
    inMemoryFriendshipRelationshipsRepository =
      new InMemoryFriendshipRelationshipsRepository();
    sut = new FollowUserUseCase(
      inMemoryFollowerRelationshipsRepository,
      inMemoryUsersRepository,
      inMemoryFriendshipRelationshipsRepository,
    );
  });

  it('should be able to follow a user', async () => {
    const follower = makeUser({}, new UniqueEntityID('follower-1'));
    const following = makeUser({}, new UniqueEntityID('following-1'));

    inMemoryUsersRepository.items.push(...[follower, following]);

    const result = await sut.execute({
      followerId: 'follower-1',
      followingId: 'following-1',
    });

    expect(result.isRight()).toBe(true);
    expect(follower.followingCount).toBe(1);
    expect(following.followersCount).toBe(1);
  });
});
