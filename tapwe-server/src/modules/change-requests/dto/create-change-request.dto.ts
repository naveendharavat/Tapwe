import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../common/decorators/transform.decorators.js';

export class CreateChangeRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Tell us what the card should open.' })
  @MaxLength(500)
  message: string;
}
