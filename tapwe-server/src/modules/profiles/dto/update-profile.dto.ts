import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { NormalizePhoneOrNull, TrimToNull } from '../../../common/decorators/transform.decorators.js';
import { IsHttpUrl } from '../../../common/validators/is-http-url.validator.js';

export class UpdateProfileDto {
  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(120)
  businessName?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(200)
  description?: string | null;

  @IsOptional()
  @NormalizePhoneOrNull()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit mobile number.' })
  phone?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsHttpUrl()
  @MaxLength(500)
  website?: string | null;
}
