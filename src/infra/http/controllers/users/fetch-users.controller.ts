import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginateUsersUseCase } from 'src/domain/users/application/usecases/paginate-users.usecase';

import { UserPresenter } from 'src/infra/http/presenters/user.presenter';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import { zodToOpenAPI } from 'nestjs-zod';

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

const fetchUsersResponseSchema = z.array(userResponseSchema);

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema);

type QueryParamSchema = z.infer<typeof queryParamsSchema>;

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class FetchUsersController {
  constructor(private readonly paginateUsersUseCase: PaginateUsersUseCase) {}

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
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários paginada.',
    content: {
      'application/json': {
        schema: zodToOpenAPI(fetchUsersResponseSchema),
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
  ): Promise<Record<string, any>> {
    const { page, limit } = queryParams;

    const result = await this.paginateUsersUseCase.execute({
      page,
      limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { data, totalCount } = result.value;

    response.setHeader('X-Total-Count', totalCount);

    const users = data.map(UserPresenter.toHTTP);

    return response.json(users);
  }
}
