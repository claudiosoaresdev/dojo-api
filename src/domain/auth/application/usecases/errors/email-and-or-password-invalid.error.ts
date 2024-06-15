import { UseCaseError } from 'src/core/errors/use-case-error';

export class EmailAndOrPassowrdInvalidError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`E-mail and/or Password invalid.`);
  }
}
