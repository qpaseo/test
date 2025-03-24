import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { RateLimitMiddleware } from './middleware/RateLimitMiddleware';
import { Redis } from 'ioredis'; // Redis 객체 가져오기

async function bootstrap() {
  // Fastify 어댑터를 사용하여 NestJS 앱 생성
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(), // FastifyAdapter 설정
  );

  // 글로벌 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 포함되면 예외 발생
      transform: true, // 요청 데이터의 타입 자동 변환
    }),
  );

  const fastify = app.getHttpAdapter().getInstance();

  // Redis 객체를 수동으로 생성
  const redis = app.get(Redis); // Redis 객체 가져오기

  // RateLimitMiddleware를 NestJS DI 시스템을 통해 사용
  const rateLimitMiddleware = app.get(RateLimitMiddleware);

  // 미들웨어 등록
  fastify.addHook('onRequest', async (req, res) => {
    await rateLimitMiddleware.use(req, res, () => {});
  });

  // Swagger 설정
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // 앱 포트 설정 및 실행
  await app.listen(process.env.PORT ?? 3000); // 환경 변수로 포트 설정 (기본 3000)
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
