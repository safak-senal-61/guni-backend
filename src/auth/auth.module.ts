import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({}),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
