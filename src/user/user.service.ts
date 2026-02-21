import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(login: string) {
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }
}
