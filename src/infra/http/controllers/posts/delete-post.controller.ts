import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DeletePostUseCase } from 'src/domain/feed/application/usecases/delete-post.usecase';
import { PostNotFoundError } from 'src/domain/feed/application/usecases/errors/post-not-found.error';

@Controller('posts/:postId')
@ApiTags('posts')
@ApiBearerAuth()
export class DeletePostController {
  constructor(private readonly deletePostUseCase: DeletePostUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'ID da postagem a ser deletado',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 204,
    description: 'Postagem deletada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de postagem inválido ou erro ao deletar a postagem.',
  })
  public async handle(@Param('postId') postId: string): Promise<void> {
    const result = await this.deletePostUseCase.execute({
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
  }
}
