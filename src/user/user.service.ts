import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUserDto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const salt = 10;
    const cryptoPassword = await bcrypt.hash(password, salt);
    return cryptoPassword;
  }

  async findOne(login: string) {
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const isExistTrainer = await this.findOne(createUserDto.login);
    if (isExistTrainer) {
      throw new BadRequestException('the User has already been created');
    }
    const { password, ...registrationData } = createUserDto;
    const cryptoPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
      },
    });

    const payload = { login: createUserDto.login };
    const access_token = this.jwtService.sign(payload);

    return { user, access_token };
  }
}
