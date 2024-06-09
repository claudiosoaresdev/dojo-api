import { faker } from '@faker-js/faker';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { User, UserProps } from 'src/domain/users/enterprise/entities/user';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      displayName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}
