import { User } from 'src/domain/users/enterprise/entities/user';

import {
  UserPresenterResponse,
  UserPresenter,
} from 'src/infra/http/presenters/user.presenter';

export interface AuthPresenterResponse {
  user: UserPresenterResponse;
  accessToken: string;
  refreshToken?: string;
}

export class AuthPresenter {
  static toHTTP(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthPresenterResponse {
    return {
      user: UserPresenter.toHTTP(user),
      accessToken,
      refreshToken,
    };
  }
}
