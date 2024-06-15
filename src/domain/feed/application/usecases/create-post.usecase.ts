import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

interface CreatePostUseCaseRequest {
  content: string;
  authorId: string;
}

type CreatePostUseCaseResponse = Either<
  UserNotFoundError,
  {
    post: Post;
  }
>;

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute({
    content,
    authorId,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const userExists = await this.usersRepository.findById(authorId);

    if (!userExists) {
      return left(new UserNotFoundError());
    }

    const post = Post.create({
      content,
      authorId: userExists.id,
    });

    await this.postsRepository.create(post);

    return right({
      post,
    });
  }
}
