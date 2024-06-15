import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from 'src/infra/env/config/env.config';

import { AuthModule } from 'src/infra/auth/auth.module';
import { HttpModule } from 'src/infra/http/http.module';
import { EnvModule } from 'src/infra/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
