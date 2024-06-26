import { UseCaseError } from 'src/core/errors/use-case-error';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || `User already exists.`);
  }
}
