import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { UpdateUserUseCase } from 'src/domain/users/application/usecases/update-user.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdateUserUseCase;

describe('Update User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to update a user', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: 'user-1',
      email: 'johnwic2k@email.com',
    });

    expect(result.isRight()).toBe(true);
  });
});
