import { Global, Module } from '@nestjs/common';

import { EnvService } from 'src/infra/env/services/env.service';

@Global()
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
