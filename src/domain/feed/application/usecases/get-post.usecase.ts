import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

interface GetPostUseCaseRequest {
  postId: string;
}

type GetPostUseCaseResponse = Either<
  PostNotFoundError,
  {
    post: Post;
  }
>;

@Injectable()
export class GetPostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({
    postId,
  }: GetPostUseCaseRequest): Promise<GetPostUseCaseResponse> {
    const postExists = await this.postsRepository.findById(postId);

    if (!postExists) {
      return left(new PostNotFoundError());
    }

    return right({
      post: postExists,
    });
  }
}
