import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

interface DeletePostUseCaseRequest {
  postId: string;
}

type DeletePostUseCaseResponse = Either<PostNotFoundError, null>;

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({
    postId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const postExists = await this.postsRepository.findById(postId);

    if (!postExists) {
      return left(new PostNotFoundError());
    }

    await this.postsRepository.delete(postExists);

    return right(null);
  }
}
