import { faker } from '@faker-js/faker';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

import { Post, PostProps } from 'src/domain/feed/enterprise/entities/post';

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID,
) {
  const post = Post.create(
    {
      authorId: override.authorId,
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return post;
}
