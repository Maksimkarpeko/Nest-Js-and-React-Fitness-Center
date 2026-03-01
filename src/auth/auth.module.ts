import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TrainerModule } from '../trainer/trainer.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  LocalTrainerStrategy,
} from './strategy/localTrainer.strategy.js';
import { LocalUserStrategy } from './strategy/localUser.strategy.js';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    TrainerModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalUserStrategy, LocalTrainerStrategy],
})
export class AuthModule {}
