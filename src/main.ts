import { NestFactory } from '@nestjs/core';
import { AppModule } from './application.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));
  app.use(cookieParser());
  app.enableCors(
    {
      // origin: 'http://127.0.0.1:3090',
      credentials: true,
    }
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(express.static(path.join(__dirname, '/public')));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(4100);
}

bootstrap();
