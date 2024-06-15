import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { AuthenticateUserUseCase } from 'src/domain/auth/application/usecases/authenticate-user.usecase';

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe('Authenticate User', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate user', async () => {
    const passwordHash = await fakeHasher.hash('123456');

    const user = makeUser(
      {
        firstName: 'Tester',
        lastName: 'Tester',
        email: 'teste@teste.com',
        password: passwordHash,
      },
      new UniqueEntityID('user-1'),
    );

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to authenticate user because email is wrong', async () => {
    const passwordHash = await fakeHasher.hash('123456');

    const user = makeUser(
      {
        firstName: 'Tester',
        lastName: 'Tester',
        email: 'teste@teste.com',
        password: passwordHash,
      },
      new UniqueEntityID('user-1'),
    );

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'teste2@teste.com',
      password: '123457',
    });

    expect(result.isLeft()).toBe(true);
  });

  it('should not be able to authenticate user because password is wrong', async () => {
    const passwordHash = await fakeHasher.hash('123456');

    const user = makeUser(
      {
        firstName: 'Tester',
        lastName: 'Tester',
        email: 'teste@teste.com',
        password: passwordHash,
      },
      new UniqueEntityID('user-1'),
    );

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'teste@teste.com',
      password: '123457',
    });

    expect(result.isLeft()).toBe(true);
  });
});
