import { CreateUserUseCase } from 'src/domain/users/application/usecases/create-user.usecase';

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      displayName: 'John Wick',
      email: 'johnwick@email.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
  });
});
