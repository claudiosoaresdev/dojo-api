import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { GetUserUseCase } from 'src/domain/users/application/usecases/get-user.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserUseCase;

describe('Get User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get a user', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
  });
});
