import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Authenticated } from './interface/auth.interface.js';
import { LocalAuthTrainerGuards } from './Guards/LocalAuthTrainerGuard.js';
import { LocalAuthUserGuards } from './Guards/LocalAuthUserGuards.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  getHello() {
    return 'Hello World';
  }

  @UseGuards(LocalAuthUserGuards)
  @Post('login/user')
  signInUser(@Request() req: Authenticated) {
    return this.authService.login(req);
  }

  @UseGuards(LocalAuthTrainerGuards)
  @Post('login/trainer')
  signInTrainer(@Request() req: Authenticated) {
    return this.authService.login(req);
  }


}
