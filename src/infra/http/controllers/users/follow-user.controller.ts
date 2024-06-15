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

import { FollowUserUseCase } from 'src/domain/users/application/usecases/follow-user.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

import { CurrentUser } from 'src/infra/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/infra/auth/strategies/jwt.strategy';

@Controller('users/:followingId/follow')
@ApiTags('users')
@ApiBearerAuth()
export class FollowUserController {
  constructor(private readonly followUserUseCase: FollowUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Usuário seguido com sucesso.',
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

    const result = await this.followUserUseCase.execute({
      followerId,
      followingId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }
  }
}
