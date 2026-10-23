import { IsIn, IsOptional } from 'class-validator';
import { CARD_REQUEST_STATUSES, type CardRequestStatus } from '../entities/card-request.entity.js';

export class ListCardRequestsQueryDto {
  @IsOptional()
  @IsIn(CARD_REQUEST_STATUSES)
  status?: CardRequestStatus;
}
