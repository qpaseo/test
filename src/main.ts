import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:5173', 'https://umunjeong.netlify.app'],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS', // 허용된 HTTP 메서드
    allowedHeaders: 'Content-Type, Authorization', // 허용된 헤더
    credentials: true, // 쿠키 전송 허용 (필요한 경우)
    optionsSuccessStatus: 204, // OPTIONS 요청 성공 상태 코드
  });

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,PATCH,OPTIONS',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).send();
    } else {
      next();
    }
  });
}

bootstrap();
