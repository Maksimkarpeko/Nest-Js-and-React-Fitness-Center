import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTrainerDto } from './Dto/createTrainerDto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TrainerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const salt = 10;
    const cryptoPassword = await bcrypt.hash(password, salt);
    return cryptoPassword;
  }

  async getTrainer() {
    return await this.prisma.trainer.findMany();
  }

  async findOne(login: string) {
    return await this.prisma.trainer.findFirst({
      where: { login },
    });
  }

  async create(createTrainerDto: CreateTrainerDto) {
    const isExistTrainer = await this.findOne(createTrainerDto.login);
    if (isExistTrainer) {
      throw new BadRequestException('the Trainer has already been created');
    }
    const { password, ...registrationData } = createTrainerDto;
    const cryptoPassword = await this.hashPassword(password);
    const trainer = await this.prisma.trainer.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
      },
    });

    const payload = { login: createTrainerDto.login };
    const access_token = this.jwtService.sign(payload);

    return { trainer, access_token };
  }
}
