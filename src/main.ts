import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { helloMiddleware } from './middleware/hello.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 포함되면 예외 발생
      transform: true, // 요청 데이터의 타입 자동 변환
    }),
  );

  const fastify = app.getHttpAdapter().getInstance();
  helloMiddleware(fastify);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
