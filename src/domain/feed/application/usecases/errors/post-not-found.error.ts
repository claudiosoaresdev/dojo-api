import { UseCaseError } from 'src/core/errors/use-case-error';

export class PostNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || `Post not found.`);
  }
}
