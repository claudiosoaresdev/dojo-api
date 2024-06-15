import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export interface PostProps {
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date;
}

export class Post extends Entity<PostProps> {
  get content(): string {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get mediaUrl(): string | undefined {
    return this.props.mediaUrl;
  }

  get mediaType(): MediaType | undefined {
    return this.props.mediaType;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<PostProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Post {
    const post = new Post(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return post;
  }
}
