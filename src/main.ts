import { NestFactory } from '@nestjs/core';
import { AppModule } from './application.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import RedisStore from 'connect-redis';
import { Redis } from 'ioredis';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(session({
    store: new RedisStore({
      client: new Redis({
        host: '0.0.0.0',
        port: 6379,
      }),
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));
  app.use(cookieParser());
  app.enableCors(
    {
      credentials: true,
    }
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(4100);
}

bootstrap();
