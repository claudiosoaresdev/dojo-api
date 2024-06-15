import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import {
  PaginateFeedUseCase,
  SortOrder,
} from 'src/domain/feed/application/usecases/paginate-feed.usecase';
import { UserNotFoundError } from 'src/domain/users/application/usecases/errors/user-not-found.error';

import { CurrentUser } from 'src/infra/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/infra/auth/strategies/jwt.strategy';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import { PostPresenter } from 'src/infra/http/presenters/post.presenter';

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().min(1)),
  sortOrder: z.enum(['RECENT', 'RELEVANT']).optional(),
});

const postResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
});

const fetchPostsResponseSchema = z.array(postResponseSchema);

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema);

type QueryParamSchema = z.infer<typeof queryParamsSchema>;

@Controller('feed')
@ApiTags('feed')
@ApiBearerAuth()
export class FetchFeedController {
  constructor(private readonly paginateFeedUseCase: PaginateFeedUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    description: 'Número da página para paginação',
    required: false,
    schema: { type: 'string', default: '1' },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número de itens por página para paginação',
    required: false,
    schema: { type: 'string', default: '10' },
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Ordem de classificação dos posts',
    required: false,
    enum: SortOrder,
    schema: { default: SortOrder.RECENT },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de postagens paginada.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(fetchPostsResponseSchema),
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de consulta inválidos.',
  })
  public async handle(
    @Query(queryValidationPipe) queryParams: QueryParamSchema,
    @Res() response: Response,
    @CurrentUser() user: UserPayload,
  ): Promise<Record<string, any>> {
    const userId = user.sub;
    const { page, limit, sortOrder } = queryParams;

    const result = await this.paginateFeedUseCase.execute({
      userId,
      page,
      limit,
      sortOrder: SortOrder[sortOrder],
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

    const { data, totalCount } = result.value;

    response.setHeader('X-Total-Count', totalCount);

    const posts = data.map(PostPresenter.toHTTP);

    return response.json(posts);
  }
}
