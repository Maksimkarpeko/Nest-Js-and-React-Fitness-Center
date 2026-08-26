import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOneByLogin(login: string) {
    return await this.prisma.user.findUnique({
      where: { login },
      include: {
        review: true,
        subscription: true,
        userGroups: true,
        visitings: true,
      },
    });
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
      include: {
        trainerProfile: true,
        subscription: true,
        review: true,
        userGroups: true,
        visitings: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const isExistUser = await this.findOneByLogin(createUserDto.login);

    if (isExistUser) {
      throw new BadRequestException('The user has already been created');
    }

    const { password, ...registrationData } = createUserDto;

    const cryptoPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
      },
    });

    const payload = {
      userId: user.userId,
      login: user.login,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      access_token,
    };
  }
}
