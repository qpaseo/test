import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors 설정
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://web-umunjeong-server-m637n0dz9587ba58.sel4.cloudtype.app',
      ],
      methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
      allowedHeaders: '*',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
