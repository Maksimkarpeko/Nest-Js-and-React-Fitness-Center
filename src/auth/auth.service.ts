import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';
import { Registration } from './interface/registraton.interface.js';
import * as bcrypt from 'bcrypt';
import { TrainerService } from '../trainer/trainer.service.js';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private trainerService: TrainerService,
  ) {}

  private validateDate(birthDate: string) {
    const [day, month, year] = birthDate.split('.').map(Number);
    const formattedDate = new Date(year, month - 1, day);
    return formattedDate;
  }

  private async hashPassword(password: string) {
    const salt = 10;
    const cryptoPassword = await bcrypt.hash(password, salt);
    return cryptoPassword;
  }

  async signInUser(login: string, pass: string) {
    const user = await this.userService.findOne(login);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...res } = user;

    return res;
  }

  async signInTrainer(login: string, pass: string) {
    const trainer = await this.trainerService.findOne(login);
    if (!trainer) {
      throw new UnauthorizedException('Invalid trainer');
    }
    const isMatch = await bcrypt.compare(pass, trainer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...res } = trainer;
    return res;
  }

  async signUpUser(registration: Registration) {
    const { password, birthDate, ...registrationData } = registration;
    const validateDate = this.validateDate(birthDate);
    const cryptoPassword = await this.hashPassword(password);
    return await this.prisma.user.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
        birthDate: validateDate,
      },
    });
  }

  async signUpTrainer(registration: Registration) {
    const { password, birthDate, ...registrationData } = registration;
    const cryptoPassword = await this.hashPassword(password);
    const validateDate = this.validateDate(birthDate);
    return await this.prisma.trainer.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
        birthDate: validateDate,
      },
    });
  }
}
