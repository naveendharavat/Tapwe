import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TrimToNull } from '../../../common/decorators/transform.decorators.js';
import { CARD_STATUSES, type CardStatus } from '../entities/card.entity.js';

export class ListCardsQueryDto {
  @IsOptional()
  @IsIn(CARD_STATUSES)
  status?: CardStatus;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(190)
  search?: string | null;
}
