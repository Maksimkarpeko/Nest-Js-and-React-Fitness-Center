import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async signIn(login: string, pass: string) {
    const user = await this.userService.findOne(login);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...res } = user;
    console.log(password);
    return res;
  }
}
