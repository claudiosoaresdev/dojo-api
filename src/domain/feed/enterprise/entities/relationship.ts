import { Entity } from 'src/core/entities/entity';

export interface RelationshipProps {
  createdAt: Date;
}

export abstract class Relationship<
  Props extends RelationshipProps,
> extends Entity<Props> {
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
