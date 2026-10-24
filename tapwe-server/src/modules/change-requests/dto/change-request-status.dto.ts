import { IsIn, IsOptional } from 'class-validator';
import { CHANGE_REQUEST_STATUSES, type ChangeRequestStatus } from '../entities/change-request.entity.js';

export class ListChangeRequestsQueryDto {
  @IsOptional()
  @IsIn(CHANGE_REQUEST_STATUSES)
  status?: ChangeRequestStatus;
}

export class UpdateChangeRequestStatusDto {
  @IsIn(CHANGE_REQUEST_STATUSES)
  status: ChangeRequestStatus;
}
