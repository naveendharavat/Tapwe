import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { NormalizeEmail, Trim, TrimToNull } from '../../../common/decorators/transform.decorators.js';
import { IsHttpUrl } from '../../../common/validators/is-http-url.validator.js';
import {
  CARD_STATUSES,
  DESTINATION_TYPES,
  type CardStatus,
  type DestinationType,
} from '../entities/card.entity.js';

export class ProvisionCardDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Give your card a name so you can find it later.' })
  @MaxLength(120)
  name: string;

  @IsOptional()
  @NormalizeEmail()
  @IsEmail({}, { message: 'Enter a valid email address.' })
  ownerEmail?: string | null;

  @IsOptional()
  @IsIn(CARD_STATUSES)
  status?: CardStatus;

  @IsIn(DESTINATION_TYPES)
  destinationType: DestinationType;

  @IsOptional()
  @TrimToNull()
  @IsHttpUrl()
  @MaxLength(500)
  destinationUrl?: string | null;
}
