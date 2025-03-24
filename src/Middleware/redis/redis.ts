import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const RedisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (
    configService: ConfigService,
  ): Promise<RedisClientType> => {
    const client = createClient({
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
    });
    client.on('error', (err) => console.error('Redis Client Error:', err));
    await client.connect();
    return client as unknown as RedisClientType; // 명시적 캐스팅 적용
  },
  inject: [ConfigService],
};
