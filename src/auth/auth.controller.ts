import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
// import { AuthDto } from './Dto/authDto.dto.js';
import { RegistrationDto } from './Dto/registration.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { Authenticated } from './interface/auth.interface.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  getHello() {
    return 'Hello World';
  }

  @UseGuards(AuthGuard('local_user'))
  @Post('login/user')
  signInUser(@Request() req: Authenticated) {
    return this.authService.login(req);
  }

  @UseGuards(AuthGuard('local_trainer'))
  @Post('login/trainer')
  signInTrainer(@Request() req: Authenticated) {
    return this.authService.login(req);
  }


  @Post('registration/user')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  signUpUser(@Body() signUpDto: RegistrationDto) {
    return this.authService.signUpUser(signUpDto);
  }

  @Post('registration/trainer')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  signUpTrainer(@Body() signUpDto: RegistrationDto) {
    return this.authService.signUpTrainer(signUpDto);
  }
}
