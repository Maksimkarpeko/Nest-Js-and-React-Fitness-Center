import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../decoration/current-user.decorator.js';
import { AuthPayload } from '../interface/auth.interface.js';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  validate(payload: AuthPayload): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException(
        'Невалидный токен: отсутствует ID пользователя',
      );
    }

    return {
      userId: payload.sub,
      login: payload.login,
      role: payload.role,
    };
  }
}
