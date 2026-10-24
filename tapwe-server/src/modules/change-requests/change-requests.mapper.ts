import { ChangeRequest, ChangeRequestStatus } from './entities/change-request.entity.js';

export interface ChangeRequestResponse {
  id: number;
  cardCode: string;
  cardName: string | null;
  message: string;
  status: ChangeRequestStatus;
  createdAt: Date;
}

export function toChangeRequestResponse(request: ChangeRequest): ChangeRequestResponse {
  return {
    id: request.id,
    cardCode: request.cardCode,
    cardName: request.card?.name ?? null,
    message: request.message,
    status: request.status,
    createdAt: request.createdAt,
  };
}
