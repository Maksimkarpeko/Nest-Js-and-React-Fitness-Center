import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './Dto/authDto.dto.js';
import { RegistrationDto } from './Dto/registration.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  getHello() {
    return 'Hello World';
  }
  @Post('login/user')
  async signInUser(@Body() signDTO: AuthDto) {
    return await this.authService.signInUser(signDTO.login, signDTO.password);
  }

  @Post('login/trainer')
  async signInTrainer(@Body() signDto: AuthDto) {
    return await this.authService.signInTrainer(signDto.login, signDto.password);
  }
  @Post('registration/user')
  signUpUser(@Body() signUpDto: RegistrationDto) {
    return this.authService.signUpUser(signUpDto);
  }

  @Post('registration/trainer')
  signUpTrainer(@Body() signUpDto: RegistrationDto) {
    return this.authService.signUpTrainer(signUpDto);
  }
}
