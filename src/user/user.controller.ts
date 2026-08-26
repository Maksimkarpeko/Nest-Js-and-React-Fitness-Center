import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/createUserDto.js';
import { JwtAuthGuard } from '../auth/Guards/JwtAuthGuard.js';
import { CurrentUser } from '../auth/decoration/current-user.decorator.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser('userId') userId: number) {
    return this.userService.findOneById(userId);
  }
}
