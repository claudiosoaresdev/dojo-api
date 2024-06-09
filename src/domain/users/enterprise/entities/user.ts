import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export interface UserProps {
  displayName: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get displayName(): string {
    return this.props.displayName;
  }

  set displayName(displayName: string) {
    this.props.displayName = displayName;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password(): string | undefined {
    return this.props.password;
  }

  set password(password: string | undefined) {
    this.props.password = password;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): User {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
