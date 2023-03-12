import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true })
  ],
  providers: [AuthService,SessionSerializer,LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
