import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { CreatePostUseCase } from 'src/domain/feed/application/usecases/create-post.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

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
    if (result.isRight()) {
      expect(inMemoryPostsRepository.items[0]).toEqual(result.value.post);
    }
  });

  it('should not be able to create a post when user not found', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      authorId: 'user-2',
      content: 'New post',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
