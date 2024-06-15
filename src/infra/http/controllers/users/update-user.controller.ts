import {
  BadRequestException,
  Controller,
  HttpStatus,
  Param,
  HttpCode,
  Put,
  Body,
} from '@nestjs/common';
import { z } from 'zod';

import { UpdateUserUseCase } from 'src/domain/users/application/usecases/update-user.usecase';

import {
  UserPresenter,
  UserPresenterResponse,
} from 'src/infra/http/presenters/user.presenter';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

const updateUserBodyParamsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  email: z.string().email(),
  password: z.string().optional(),
});

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

const updateUserBodyParamsValidationPipe = new ZodValidationPipe(
  updateUserBodyParamsSchema,
);

type UpdateUserBodyParamsSchema = z.infer<typeof updateUserBodyParamsSchema>;

@Controller('users/:userId')
@ApiTags('users')
@ApiBearerAuth()
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID do usuário a ser atualizado',
    schema: { type: 'string' },
  })
  @ApiBody({
    description: 'Dados do usuário a serem atualizados',
    schema: zodToOpenAPI(updateUserBodyParamsSchema),
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(userResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos ou erro ao atualizar o usuário.',
  })
  public async handle(
    @Param('userId') userId: string,
    @Body(updateUserBodyParamsValidationPipe) body: UpdateUserBodyParamsSchema,
  ): Promise<UserPresenterResponse> {
    const { firstName, lastName, bio, email, password } = body;

    const result = await this.updateUserUseCase.execute({
      userId,
      firstName,
      lastName,
      bio,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
