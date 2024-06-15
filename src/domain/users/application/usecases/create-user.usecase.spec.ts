import { CreateUserUseCase } from 'src/domain/users/application/usecases/create-user.usecase';

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe('Create User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Wick',
      email: 'johnwick@email.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryUsersRepository.items[0]).toEqual(result.value.user);
    }
  });
});
