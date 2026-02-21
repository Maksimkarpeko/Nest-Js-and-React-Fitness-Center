import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TrainerModule } from '../trainer/trainer.module.js';

@Module({
  imports: [UserModule, PrismaModule, TrainerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
