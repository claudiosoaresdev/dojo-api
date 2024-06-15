import { UseCaseError } from 'src/core/errors/use-case-error';

export class FollowRelationshipNotFoundError
  extends Error
  implements UseCaseError
{
  constructor(message?: string) {
    super(message || `Follow relationship not found.`);
  }
}
