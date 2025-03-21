import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis'; // Redis
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경변수

@Module({
  imports: [
    //configService에 환경변수 등록
    ConfigModule.forRoot({
      load: [() => ({ Redis_DATABASE_URL: process.env.Redis_DATABASE_URL })],
    }),

    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single', // single : 단일 연결 | cluster : 다수연결 | sentinel : 고가용성 연결(장애 해결을 위한거) {전부 형식이 다름}
        url: configService.get<string>('Redis_DATABASE_URL'),
      }),
    }),
  ],
})
export class RredisModule {}
