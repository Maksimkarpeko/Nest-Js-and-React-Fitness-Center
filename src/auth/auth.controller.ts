import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegistrationDto } from './Dto/regectration.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signDTO: RegistrationDto) {
    return await this.authService.signIn(signDTO.login, signDTO.pass);
  }
}
