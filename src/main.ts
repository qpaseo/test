//인증, crud, 이미지 처리
//게시판 (작성자, 재목, 내용 + 이미지)
//엑세스 토큰 제발급
//chat gpt 연결법은 확인했는데 어디에 사용할지 정하지 않아서 사용은 안함

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from 'fastify-multipart'; 

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
