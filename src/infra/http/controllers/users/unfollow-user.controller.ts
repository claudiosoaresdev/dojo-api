import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UnfollowUserUseCase } from 'src/domain/users/application/usecases/unfollow-user.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';
import { FollowRelationshipNotFoundError } from 'src/domain/users/application/usecases/errors/follow-relationship-not-found.error';

import { CurrentUser } from 'src/infra/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/infra/auth/strategies/jwt.strategy';

@Controller('users/:followingId/unfollow')
@ApiTags('users')
@ApiBearerAuth()
export class UnfollowUserController {
  constructor(private readonly unfollowUserUseCase: UnfollowUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Usuário deixou de ser seguido com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos.',
  })
  public async handle(
    @Param('followingId') followingId: string,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    const followerId = user.sub;

    const result = await this.unfollowUserUseCase.execute({
      followerId,
      followingId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case FollowRelationshipNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
