import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

import { Env } from 'src/infra/env/config/env.config';

import { AppModule } from 'src/infra/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    exposedHeaders: ['X-Total-Count'],
  });

  const config = new DocumentBuilder()
    .setTitle('Dojo API')
    .setDescription(
      'Dojo API é uma rede social dedicada a artistas marciais e esportistas, oferecendo uma plataforma para compartilhamento de experiências, treinos, conquistas e conexões. A API da Dojo API fornece os endpoints necessários para gerenciar usuários, posts, interações e conexões entre os membros da comunidade.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:3333')
    .addTag('auth')
    .addTag('users')
    .addTag('feed')
    .addTag('posts')
    .build();

  patchNestJsSwagger();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}
bootstrap();
