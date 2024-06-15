import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';

import { CreatePostUseCase } from 'src/domain/feed/application/usecases/create-post.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

import { CurrentUser } from 'src/infra/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/infra/auth/strategies/jwt.strategy';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import {
  PostPresenter,
  PostPresenterResponse,
} from 'src/infra/http/presenters/post.presenter';

const createPostBodyParamsSchema = z.object({
  content: z.string(),
});

const createPostResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
});

class CreatePostDto extends createZodDto(createPostBodyParamsSchema) {}

const bodyParamsValidationPipe = new ZodValidationPipe(
  createPostBodyParamsSchema,
);

type CreatePostBodyParamsSchema = z.infer<typeof createPostBodyParamsSchema>;

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth()
export class CreatePostController {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Endpoint para criar uma nova postagem.',
    schema: zodToOpenAPI(createPostBodyParamsSchema),
    required: true,
    type: CreatePostDto,
    examples: {
      exemplo1: {
        summary: 'Exemplo de dados válidos',
        value: {
          content: 'New content',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Postagem criada com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(createPostResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos.',
  })
  public async handle(
    @Body(bodyParamsValidationPipe) body: CreatePostBodyParamsSchema,
    @CurrentUser() user: UserPayload,
  ): Promise<PostPresenterResponse> {
    const authorId = user.sub;
    const { content } = body;

    const result = await this.createPostUseCase.execute({
      authorId,
      content,
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

    const { post } = result.value;

    return PostPresenter.toHTTP(post);
  }
}
