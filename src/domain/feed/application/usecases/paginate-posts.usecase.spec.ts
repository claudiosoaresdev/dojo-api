import { PaginatePostsUseCase } from 'src/domain/feed/application/usecases/paginate-posts.usecase';

import { makePost } from 'test/factories/make-post';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: PaginatePostsUseCase;

describe('Paginate Posts', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new PaginatePostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to paginate posts', async () => {
    const post1 = makePost();
    const post2 = makePost();
    const post3 = makePost();
    const post4 = makePost();
    const post5 = makePost();
    const post6 = makePost();

    inMemoryPostsRepository.items.push(post1);
    inMemoryPostsRepository.items.push(post2);
    inMemoryPostsRepository.items.push(post3);
    inMemoryPostsRepository.items.push(post4);
    inMemoryPostsRepository.items.push(post5);
    inMemoryPostsRepository.items.push(post6);

    const result = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.data).toHaveLength(6);
    expect(result.value?.totalCount).toBe(6);
  });
});
