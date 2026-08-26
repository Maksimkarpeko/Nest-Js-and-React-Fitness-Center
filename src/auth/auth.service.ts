import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { Authenticated, AuthPayload } from './interface/auth.interface.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(login: string, passwordUser: string) {
    const user = await this.userService.findOneByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const isMatch = await bcrypt.compare(passwordUser, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, ...res } = user;

    return res;
  }

  login(user: Authenticated) {
    const payload = {
      sub: user.userId,
      login: user.login,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<AuthPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const accessToken = this.jwtService.sign({
        sub: payload.sub,
        login: payload.login,
        role: payload.role
      });

      return {
        access_token: accessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
