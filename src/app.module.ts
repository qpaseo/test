import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { helloMiddleware } from './middleware/hello.middleware';
import { AppController } from './app.controller';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helloMiddleware).forRoutes('*'); // 모든 요청에 대해 미들웨어 적용
  }
}
