//인증, crud, 이미지 처리
//게시판 (작성자, 재목, 내용 + 이미지)
//엑세스 토큰 제발급

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from 'fastify-multipart'; // 기본 import 방식을 사용

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Fastify에 fastify-multipart 플러그인 비동기 등록
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyMultipart); // 비동기 등록

  await app.listen(3000);
}

bootstrap();
