import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DeleteUserUseCase } from 'src/domain/users/application/usecases/delete-user.usecase';

@Controller('users/:userId')
@ApiTags('users')
@ApiBearerAuth()
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID do usuário a ser deletado',
    schema: { type: 'string' },
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de usuário inválido ou erro ao deletar o usuário.',
  })
  public async handle(@Param('userId') userId: string): Promise<void> {
    const result = await this.deleteUserUseCase.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
