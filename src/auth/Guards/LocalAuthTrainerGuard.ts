import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthTrainerGuards extends AuthGuard('local_trainer') {}
