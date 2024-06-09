import { UseCaseError } from 'src/core/errors/use-case-error';

export class UserNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || `User not found.`);
  }
}
