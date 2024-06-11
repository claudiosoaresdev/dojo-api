import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { PaginatePostsUseCase } from 'src/domain/feed/application/usecases/paginate-posts.usecase';

import { makePost } from 'test/factories/make-post';
import { makeUser } from 'test/factories/make-user';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: PaginatePostsUseCase;

describe('Paginate Posts', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new PaginatePostsUseCase(
      inMemoryPostsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to paginate posts', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const post1 = makePost({
      authorId: user.id,
    });
    const post2 = makePost({
      authorId: user.id,
    });
    const post3 = makePost({
      authorId: user.id,
    });
    const post4 = makePost({
      authorId: user.id,
    });
    const post5 = makePost({
      authorId: user.id,
    });
    const post6 = makePost({
      authorId: user.id,
    });

    inMemoryPostsRepository.items.push(post1);
    inMemoryPostsRepository.items.push(post2);
    inMemoryPostsRepository.items.push(post3);
    inMemoryPostsRepository.items.push(post4);
    inMemoryPostsRepository.items.push(post5);
    inMemoryPostsRepository.items.push(post6);

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
});
