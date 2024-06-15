import {
  BadRequestException,
  Controller,
  HttpStatus,
  Param,
  HttpCode,
  Put,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { z } from 'zod';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import { UpdatePostUseCase } from 'src/domain/feed/application/usecases/update-post.usecase';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

import {
  PostPresenter,
  PostPresenterResponse,
} from 'src/infra/http/presenters/post.presenter';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';

const updatePostBodyParamsSchema = z.object({
  content: z.string(),
});

const postResponseSchema = z.object({
  id: z.string(),
  conent: z.string(),
});

const updatePostBodyParamsValidationPipe = new ZodValidationPipe(
  updatePostBodyParamsSchema,
);

type UpdatePostBodyParamsSchema = z.infer<typeof updatePostBodyParamsSchema>;

@Controller('posts/:postId')
@ApiTags('posts')
@ApiBearerAuth()
export class UpdatePostController {
  constructor(private readonly updatePostUseCase: UpdatePostUseCase) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'ID da postagem a ser atualizado',
    schema: { type: 'string' },
  })
  @ApiBody({
    description: 'Dados da poastagem a serem atualizados',
    schema: zodToOpenAPI(updatePostBodyParamsSchema),
  })
  @ApiResponse({
    status: 200,
    description: 'Postagem atualizada com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(postResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos ou erro ao atualizar a postagem.',
  })
  public async handle(
    @Param('postId') postId: string,
    @Body(updatePostBodyParamsValidationPipe) body: UpdatePostBodyParamsSchema,
  ): Promise<PostPresenterResponse> {
    const { content } = body;

    const result = await this.updatePostUseCase.execute({
      postId,
      content,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PostNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { post } = result.value;

    return PostPresenter.toHTTP(post);
  }
}
