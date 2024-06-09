import { PaginateUsersUseCase } from 'src/domain/users/application/usecases/paginate-users.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: PaginateUsersUseCase;

describe('Paginate Users', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new PaginateUsersUseCase(inMemoryUsersRepository);
  });

  it('should be able to paginate users', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const user3 = makeUser();
    const user4 = makeUser();
    const user5 = makeUser();
    const user6 = makeUser();

    inMemoryUsersRepository.items.push(user1);
    inMemoryUsersRepository.items.push(user2);
    inMemoryUsersRepository.items.push(user3);
    inMemoryUsersRepository.items.push(user4);
    inMemoryUsersRepository.items.push(user5);
    inMemoryUsersRepository.items.push(user6);

    const result = await sut.execute({
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.data).toHaveLength(6);
    expect(result.value?.totalCount).toBe(6);
  });
});
