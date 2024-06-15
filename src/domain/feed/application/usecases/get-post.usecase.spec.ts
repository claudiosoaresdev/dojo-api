import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { GetPostUseCase } from 'src/domain/feed/application/usecases/get-post.usecase';

import { makePost } from 'test/factories/make-post';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: GetPostUseCase;

describe('Get Post', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new GetPostUseCase(inMemoryPostsRepository);
  });

  it('should be able to get a post', async () => {
    const post = makePost({}, new UniqueEntityID('post-1'));

    inMemoryPostsRepository.create(post);

    const result = await sut.execute({
      postId: 'post-1',
    });

    expect(result.isRight()).toBe(true);
  });
});
