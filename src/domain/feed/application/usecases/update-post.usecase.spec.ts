import { UpdatePostUseCase } from 'src/domain/feed/application/usecases/update-post.usecase';

import { makePost } from 'test/factories/make-post';
import { makeUser } from 'test/factories/make-user';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdatePostUseCase;

describe('Update Post', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new UpdatePostUseCase(inMemoryPostsRepository);
  });

  it('should be able to update a post', async () => {
    const user = makeUser();
    const post = makePost();

    inMemoryPostsRepository.items.push(post);
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      postId: post.id.toString(),
      content: 'New post 2',
    });

    expect(result.isRight()).toBe(true);
  });
});
