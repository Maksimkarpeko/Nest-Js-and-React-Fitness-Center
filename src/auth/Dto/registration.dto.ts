import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
  MinLength,
} from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  secondName: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Login must be  more than 4 symbol' })
  login: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be  more than 8 symbol' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak: add uppercase, lowercase and numbers',
  })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthDate: Date;
}
