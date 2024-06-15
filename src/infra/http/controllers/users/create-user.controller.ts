import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';

import { CreateUserUseCase } from 'src/domain/users/application/usecases/create-user.usecase';

import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import {
  UserPresenter,
  UserPresenterResponse,
} from 'src/infra/http/presenters/user.presenter';

const createUserBodyParamsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
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

class CreateUserDto extends createZodDto(createUserBodyParamsSchema) {}

const bodyParamsValidationPipe = new ZodValidationPipe(
  createUserBodyParamsSchema,
);

type CreateUserBodyParamsSchema = z.infer<typeof createUserBodyParamsSchema>;

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Endpoint para criar um novo usuário.',
    schema: zodToOpenAPI(createUserBodyParamsSchema),
    required: true,
    type: CreateUserDto,
    examples: {
      exemplo1: {
        summary: 'Exemplo de dados válidos',
        value: {
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@exemplo.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(userResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos.',
  })
  public async handle(
    @Body(bodyParamsValidationPipe) body: CreateUserBodyParamsSchema,
  ): Promise<UserPresenterResponse> {
    const { firstName, lastName, email, password } = body;

    const result = await this.createUserUseCase.execute({
      firstName,
      lastName,
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
