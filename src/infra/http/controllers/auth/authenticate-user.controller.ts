import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';

import { EmailAndOrPassowrdInvalidError } from 'src/domain/auth/application/usecases/errors/email-and-or-password-invalid.error';
import { AuthenticateUserUseCase } from 'src/domain/auth/application/usecases/authenticate-user.usecase';

import { Public } from 'src/infra/auth/metadata/public.metadata';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import {
  AuthPresenter,
  AuthPresenterResponse,
} from 'src/infra/http/presenters/auth.presenter';

const authenticateUserBodyParamsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const userPresenterResponseSchema = z.object({
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

const authPresenterResponseSchema = z.object({
  user: userPresenterResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
});

class AuthenticateUserDto extends createZodDto(
  authenticateUserBodyParamsSchema,
) {}

const bodyParamsValidationPipe = new ZodValidationPipe(
  authenticateUserBodyParamsSchema,
);

type AuthenticateUserBodyParamsSchema = z.infer<
  typeof authenticateUserBodyParamsSchema
>;

@Controller('auth/signin')
@Public()
@ApiTags('auth')
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Endpoint para autenticação de usuário com email e senha.',
    schema: zodToOpenAPI(authenticateUserBodyParamsSchema),
    required: true,
    type: AuthenticateUserDto,
    examples: {
      exemplo1: {
        summary: 'Exemplo de dados válidos',
        value: {
          email: 'usuario@exemplo.com',
          password: 'senha123',
        },
      },
      exemplo2: {
        summary: 'Exemplo de dados inválidos',
        value: {
          email: 'usuario@exemplo',
          password: '',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(authPresenterResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou senha inválidos.',
  })
  public async handle(
    @Body(bodyParamsValidationPipe) body: AuthenticateUserBodyParamsSchema,
  ): Promise<AuthPresenterResponse> {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAndOrPassowrdInvalidError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user, accessToken, refreshToken } = result.value;

    return AuthPresenter.toHTTP(user, accessToken, refreshToken);
  }
}
