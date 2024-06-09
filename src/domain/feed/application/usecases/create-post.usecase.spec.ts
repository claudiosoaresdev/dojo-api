import { CreatePostUseCase } from 'src/domain/feed/application/usecases/create-post.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreatePostUseCase;

describe('Create Post', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreatePostUseCase(
      inMemoryPostsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to create a post', async () => {
    const user = makeUser();

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      content: 'New post',
    });

    expect(result.isRight()).toBe(true);
  });
});
