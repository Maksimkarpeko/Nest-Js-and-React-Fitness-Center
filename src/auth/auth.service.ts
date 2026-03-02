import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';
import { TrainerService } from '../trainer/trainer.service.js';
import { JwtService } from '@nestjs/jwt';
import { Authenticated } from './interface/auth.interface.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    // private prisma: PrismaService,
    private userService: UserService,
    private trainerService: TrainerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, passwordUser: string) {
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

  async validateTrainer(login: string, passwordTrainer: string) {
    const trainer = await this.trainerService.findOne(login);
    if (!trainer) {
      throw new UnauthorizedException('Invalid trainer');
    }
    if (trainer.login !== login) {
      throw new UnauthorizedException('Invalid login');
    }
    const isMatch = await bcrypt.compare(passwordTrainer, trainer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...res } = trainer;
    return res;
  }

  login(user: Authenticated) {
    const payload = { login: user.login };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
