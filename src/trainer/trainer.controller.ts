import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TrainerService } from './trainer.service.js';
import { CreateTrainerDto } from './Dto/createTrainerDto.js';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  async getTrainer() {
    return this.trainerService.getTrainer();
  }

  @Post('')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  create(@Body() create: CreateTrainerDto) {
    return this.trainerService.create(create);
  }
}
