import { Post } from 'src/domain/feed/enterprise/entities/post';

export interface PostPresenterResponse {
  id: string;
  content: string;
}

export class PostPresenter {
  static toHTTP(post: Post): PostPresenterResponse {
    return {
      id: post.id.toString(),
      content: post.content,
    };
  }
}
