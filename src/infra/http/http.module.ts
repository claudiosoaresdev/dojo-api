import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/infra/database/database.module';
import { CryptographyModule } from 'src/infra/cryptography/cryptography.module';

// controller

// auth
import { AuthenticateUserController } from 'src/infra/http/controllers/auth/authenticate-user.controller';

// users
import { FetchUsersController } from 'src/infra/http/controllers/users/fetch-users.controller';
import { CreateUserController } from 'src/infra/http/controllers/users/create-user.controller';
import { GetUserController } from 'src/infra/http/controllers/users/get-user.controller';
import { UpdateUserController } from 'src/infra/http/controllers/users/update-user.controller';
import { DeleteUserController } from 'src/infra/http/controllers/users/delete-user.controller';
import { UnfollowUserController } from './controllers/users/unfollow-user.controller';
import { FollowUserController } from './controllers/users/follow-user.controller';

// usecases

// auth
import { AuthenticateUserUseCase } from 'src/domain/auth/application/usecases/authenticate-user.usecase';

// users
import { PaginateUsersUseCase } from 'src/domain/users/application/usecases/paginate-users.usecase';
import { CreateUserUseCase } from 'src/domain/users/application/usecases/create-user.usecase';
import { GetUserUseCase } from 'src/domain/users/application/usecases/get-user.usecase';
import { UpdateUserUseCase } from 'src/domain/users/application/usecases/update-user.usecase';
import { DeleteUserUseCase } from 'src/domain/users/application/usecases/delete-user.usecase';
import { FollowUserUseCase } from 'src/domain/users/application/usecases/follow-user.usecase';
import { UnfollowUserUseCase } from 'src/domain/users/application/usecases/unfollow-user.usecase';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    // auth
    AuthenticateUserController,

    // users
    FetchUsersController,
    CreateUserController,
    GetUserController,
    UpdateUserController,
    DeleteUserController,

    FollowUserController,
    UnfollowUserController,
  ],
  providers: [
    // auth
    AuthenticateUserUseCase,

    // users
    PaginateUsersUseCase,
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    FollowUserUseCase,
    UnfollowUserUseCase,
  ],
})
export class HttpModule {}
