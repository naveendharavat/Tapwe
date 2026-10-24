import { IsIn } from 'class-validator';
import { CARD_REQUEST_STATUSES, type CardRequestStatus } from '../entities/card-request.entity.js';

export class UpdateCardRequestStatusDto {
  @IsIn(CARD_REQUEST_STATUSES)
  status: CardRequestStatus;
}
