import {
  BadRequestException,
  Controller,
  HttpStatus,
  Param,
  HttpCode,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI } from 'nestjs-zod';

import { GetUserUseCase } from 'src/domain/users/application/usecases/get-user.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

import {
  UserPresenter,
  UserPresenterResponse,
} from 'src/infra/http/presenters/user.presenter';

const userResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  bio: z.string().optional(),
  coverPhotoUrl: z.string().optional(),
  profilePictureUrl: z.string().optional(),
  followersCount: z.number(),
  followingCount: z.number(),
});

@Controller('users/:userId')
@ApiTags('users')
@ApiBearerAuth()
export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID do usuário a ser buscado',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(userResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID de usuário inválido ou erro ao buscar o usuário.',
  })
  public async handle(
    @Param('userId') userId: string,
  ): Promise<UserPresenterResponse> {
    const result = await this.getUserUseCase.execute({
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
