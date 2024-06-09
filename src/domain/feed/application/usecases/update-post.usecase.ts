import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/either';

import { Post } from 'src/domain/feed/enterprise/entities/post';
import { PostsRepository } from 'src/domain/feed/application/repositories/posts.repository';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

interface UpdatePostUseCaseRequest {
  postId: string;
  content: string;
}

type UpdatePostUseCaseResponse = Either<
  PostNotFoundError,
  {
    post: Post;
  }
>;

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({
    postId,
    content,
  }: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse> {
    const postExists = await this.postsRepository.findById(postId);

    if (!postExists) {
      return left(new PostNotFoundError());
    }

    if (content && content !== postExists.content.toString()) {
      postExists.content = content;
    }

    const updatedPost = await this.postsRepository.update(postExists);

    return right({
      post: updatedPost,
    });
  }
}
