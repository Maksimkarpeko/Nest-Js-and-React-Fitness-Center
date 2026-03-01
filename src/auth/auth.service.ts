import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';
import { Registration } from './interface/registraton.interface.js';
import * as bcrypt from 'bcrypt';
import { TrainerService } from '../trainer/trainer.service.js';
import { JwtService } from '@nestjs/jwt';
import {
  Authenticated,
} from './interface/auth.interface.js';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private trainerService: TrainerService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const salt = 10;
    const cryptoPassword = await bcrypt.hash(password, salt);
    return cryptoPassword;
  }

  async validateUser(login:string,passwordUser:string) {
    const user = await this.userService.findOne(login);
    
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    if (user.login !== login) {
      throw new UnauthorizedException('Invalid login');
    }
    const isMatch = await bcrypt.compare(passwordUser, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...res } = user;

    return res;
  }

  async validateTrainer(login:string,passwordTrainer:string) {
    const trainer = await this.trainerService.findOne(login);
    if (!trainer) {
      throw new UnauthorizedException('Invalid trainer');
    }
    if (trainer.login !== login) {
      throw new UnauthorizedException('Invalid login');
    }
    const isMatch = await bcrypt.compare(
      passwordTrainer,
      trainer.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...res } = trainer;
    return res;
  }

  login(user: Authenticated) {
    const payload = { sub: user.authenticatedId, login: user.login };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async signUpUser(registrationUser: Registration) {
    const user = await this.userService.findOne(registrationUser.login);
    if (user) {
      throw new BadRequestException('the User has already been created');
    }
    const { password, ...registrationData } = registrationUser;
    const cryptoPassword = await this.hashPassword(password);
    return await this.prisma.user.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
      },
    });
  }

  async signUpTrainer(registration: Registration) {
    const trainer = await this.trainerService.findOne(registration.login);
    if (trainer) {
      throw new BadRequestException('the Trainer has already been created');
    }
    const { password, ...registrationData } = registration;
    const cryptoPassword = await this.hashPassword(password);
    return await this.prisma.trainer.create({
      data: {
        ...registrationData,
        password: cryptoPassword,
      },
    });
  }
}
