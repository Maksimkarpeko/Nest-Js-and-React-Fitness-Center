import { Controller, Get } from '@nestjs/common';
import { TrainerService } from './trainer.service.js';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  async getTrainer() {
    return this.trainerService.getTrainer();
  }
}
