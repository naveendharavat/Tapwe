import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { NormalizeEmail, Trim } from '../../../common/decorators/transform.decorators.js';

export class UpdateMeDto {
  @IsOptional()
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Enter your name.' })
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @NormalizeEmail()
  @IsNotEmpty({ message: 'Enter your email address.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email?: string;
}
