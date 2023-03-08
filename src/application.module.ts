import { CacheModule, Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/blog.service';
import { EventModule } from './gateway/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
    EventModule,
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        conf: { useFilesystemPublicRoutes: true },
      }),
    ),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOSTNAME'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController, BlogController],
  providers: [BlogService],
})
export class AppModule {}
