import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TrainerService {
  constructor(private prisma: PrismaService) {}

  async getTrainer() {
    return await this.prisma.trainer.findMany();
  }

  async findOne(login: string) {
    return await this.prisma.trainer.findFirst({
      where: { login },
    });
  }
}
