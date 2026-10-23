import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NormalizeEmail } from '../../../common/decorators/transform.decorators.js';

export class SignInDto {
  @NormalizeEmail()
  @IsNotEmpty({ message: 'Enter your email address.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter a password.' })
  password: string;
}
