import {
  ArrayMinSize,
  ArrayUnique,
  Equals,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  NormalizeEmail,
  NormalizePhone,
  Trim,
  TrimToNull,
} from '../../../common/decorators/transform.decorators.js';
import { BUSINESS_TYPES, CARD_QUANTITIES, REQUEST_DESTINATIONS } from '../card-request.options.js';

export class CreateCardRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Enter your name.' })
  @MaxLength(120)
  name: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Enter your business name.' })
  @MaxLength(120)
  businessName: string;

  @NormalizeEmail()
  @IsNotEmpty({ message: 'Enter your email address.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email: string;

  @NormalizePhone()
  @IsNotEmpty({ message: 'Enter your phone number.' })
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit mobile number.' })
  phone: string;

  @IsIn(BUSINESS_TYPES, { message: 'Choose your business type.' })
  businessType: string;

  @IsIn(CARD_QUANTITIES, { message: 'Choose how many cards.' })
  quantity: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Choose at least one option.' })
  @ArrayUnique()
  @IsIn(REQUEST_DESTINATIONS, { each: true })
  destinations: string[];

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(2000)
  note?: string | null;

  @Equals(true, { message: 'Please confirm to continue.' })
  agreed: boolean;
}
