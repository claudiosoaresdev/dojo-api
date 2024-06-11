import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export interface NotificationProps {
  recipientId: UniqueEntityID;
  title: string;
  content?: string;
  readAt?: Date | null;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId(): UniqueEntityID {
    return this.props.recipientId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string | undefined {
    return this.props.content;
  }

  get readAt(): Date | undefined {
    return this.props.readAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public read(): void {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
