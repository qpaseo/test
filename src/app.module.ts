import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { helloMiddleware } from './middleware/hello.middleware';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(middlewareConsumer: MiddlewareConsumer) {
    middlewareConsumer.apply(helloMiddleware).forRoutes('*'); // 모든 요청에 대해 미들웨어 적용
  }
}
