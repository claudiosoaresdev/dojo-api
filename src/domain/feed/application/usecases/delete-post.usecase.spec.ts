import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { DeletePostUseCase } from 'src/domain/feed/application/usecases/delete-post.usecase';

import { makePost } from 'test/factories/make-post';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: DeletePostUseCase;

describe('Delete Post', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new DeletePostUseCase(inMemoryPostsRepository);
  });

  it('should be able to delete a post', async () => {
    const post = makePost({}, new UniqueEntityID('post-1'));

    inMemoryPostsRepository.items.push(post);

    const result = await sut.execute({
      postId: 'post-1',
    });

    expect(result.isRight()).toBe(true);
  });
});
