import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/createUserDto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  create(@Body() create: CreateUserDto) {
    return this.userService.create(create);
  }
}
