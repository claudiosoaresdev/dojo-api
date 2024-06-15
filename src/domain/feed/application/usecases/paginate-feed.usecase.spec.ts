import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { PaginateFeedUseCase } from 'src/domain/feed/application/usecases/paginate-feed.usecase';

import { makeUser } from 'test/factories/make-user';
import { makePost } from 'test/factories/make-post';
import { makeFollowerRelationship } from 'test/factories/make-follower-relationship';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryFollowerRelationshipsRepository } from 'test/repositories/in-memory-follower-relationships-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFollowerRelationshipsRepository: InMemoryFollowerRelationshipsRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: PaginateFeedUseCase;

describe('Paginate Feed', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowerRelationshipsRepository =
      new InMemoryFollowerRelationshipsRepository(inMemoryUsersRepository);
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new PaginateFeedUseCase(
      inMemoryUsersRepository,
      inMemoryFollowerRelationshipsRepository,
      inMemoryPostsRepository,
    );
  });

  it('should be able to paginate feed', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const following1 = makeUser({}, new UniqueEntityID('following-1'));

    inMemoryUsersRepository.items.push(following1);

    const post1 = makePost(
      {
        authorId: following1.id,
      },
      new UniqueEntityID('post-1'),
    );
    const post2 = makePost(
      {
        authorId: following1.id,
      },
      new UniqueEntityID('post-2'),
    );

    inMemoryPostsRepository.items.push(post1);
    inMemoryPostsRepository.items.push(post2);

    const following2 = makeUser({}, new UniqueEntityID('following-2'));

    inMemoryUsersRepository.items.push(following2);

    const post3 = makePost(
      {
        authorId: following2.id,
      },
      new UniqueEntityID('post-3'),
    );

    inMemoryPostsRepository.items.push(post3);

    const following3 = makeUser({}, new UniqueEntityID('following-3'));

    inMemoryUsersRepository.items.push(following3);

    const post4 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-4'),
    );
    const post5 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-5'),
    );
    const post6 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-6'),
    );

    inMemoryPostsRepository.items.push(post4);
    inMemoryPostsRepository.items.push(post5);
    inMemoryPostsRepository.items.push(post6);

    const followerRelationship1 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following1.id,
      following: following1,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship1);

    const followerRelationship2 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following2.id,
      following: following2,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship2);

    const followerRelationship3 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following3.id,
      following: following3,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship3);

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const paginate = result.value;

      expect(paginate.data).toHaveLength(6);
      expect(paginate.totalCount).toBe(6);
    }
  });

  it('should be able to paginate feed after user unfollow', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const following1 = makeUser({}, new UniqueEntityID('following-1'));

    inMemoryUsersRepository.items.push(following1);

    const post1 = makePost(
      {
        authorId: following1.id,
      },
      new UniqueEntityID('post-1'),
    );
    const post2 = makePost(
      {
        authorId: following1.id,
      },
      new UniqueEntityID('post-2'),
    );

    inMemoryPostsRepository.items.push(post1);
    inMemoryPostsRepository.items.push(post2);

    const following2 = makeUser({}, new UniqueEntityID('following-2'));

    inMemoryUsersRepository.items.push(following2);

    const post3 = makePost(
      {
        authorId: following2.id,
      },
      new UniqueEntityID('post-3'),
    );

    inMemoryPostsRepository.items.push(post3);

    const following3 = makeUser({}, new UniqueEntityID('following-3'));

    inMemoryUsersRepository.items.push(following3);

    const post4 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-4'),
    );
    const post5 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-5'),
    );
    const post6 = makePost(
      {
        authorId: following3.id,
      },
      new UniqueEntityID('post-6'),
    );

    inMemoryPostsRepository.items.push(post4);
    inMemoryPostsRepository.items.push(post5);
    inMemoryPostsRepository.items.push(post6);

    const followerRelationship1 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following1.id,
      following: following1,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship1);

    const followerRelationship2 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following2.id,
      following: following2,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship2);

    const followerRelationship3 = makeFollowerRelationship({
      followerId: user.id,
      follower: user,
      followingId: following3.id,
      following: following3,
    });

    inMemoryFollowerRelationshipsRepository.create(followerRelationship3);

    inMemoryFollowerRelationshipsRepository.delete(followerRelationship1);

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const paginate = result.value;

      expect(paginate.data).toHaveLength(4);
      expect(paginate.totalCount).toBe(4);
    }
  });
});
