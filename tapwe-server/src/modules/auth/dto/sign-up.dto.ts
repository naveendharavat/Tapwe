import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeEmail, Trim } from '../../../common/decorators/transform.decorators.js';

export class SignUpDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Enter your name.' })
  @MaxLength(120)
  name: string;

  @NormalizeEmail()
  @IsNotEmpty({ message: 'Enter your email address.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter a password.' })
  @MinLength(8, { message: 'Use at least 8 characters.' })
  @MaxLength(72)
  password: string;
}
