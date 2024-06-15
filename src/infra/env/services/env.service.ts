import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from 'src/infra/env/config/env.config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T): any {
    return this.configService.get(key, { infer: true });
  }
}
