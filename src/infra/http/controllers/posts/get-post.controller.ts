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

import { GetPostUseCase } from 'src/domain/feed/application/usecases/get-post.usecase';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

import {
  PostPresenter,
  PostPresenterResponse,
} from 'src/infra/http/presenters/post.presenter';

const postResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
});

@Controller('posts/:postId')
@ApiTags('posts')
@ApiBearerAuth()
export class GetPostController {
  constructor(private readonly getPostUseCase: GetPostUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'ID da postagem a ser buscado',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 200,
    description: 'Postagem encontrada com sucesso.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(postResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID da postagem inválido ou erro ao buscar a postagem.',
  })
  public async handle(
    @Param('postId') postId: string,
  ): Promise<PostPresenterResponse> {
    const result = await this.getPostUseCase.execute({
      postId,
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
