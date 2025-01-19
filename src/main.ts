import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://web-umunjeong-server-m637n0dz9587ba58.sel4.cloudtype.app',
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더들
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
