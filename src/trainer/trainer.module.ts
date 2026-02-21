import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service.js';
import { TrainerController } from './trainer.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TrainerController],
  providers: [TrainerService],
  exports: [TrainerService],
})
export class TrainerModule {}
