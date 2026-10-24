import { Injectable, NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service.js';
import { ChangeRequestResponse, toChangeRequestResponse } from './change-requests.mapper.js';
import { ChangeRequestsRepository } from './change-requests.repository.js';
import { ChangeRequest, ChangeRequestStatus } from './entities/change-request.entity.js';

@Injectable()
export class ChangeRequestsService {
  constructor(
    private readonly changeRequests: ChangeRequestsRepository,
    private readonly cards: CardsService,
  ) {}

  async request(code: string, userId: number, message: string): Promise<{ id: number }> {
    await this.cards.findOwnedOrFail(code, userId);
    const { id } = await this.changeRequests.create(code, message);
    return { id };
  }

  async list(status?: ChangeRequestStatus): Promise<ChangeRequestResponse[]> {
    const requests = await this.changeRequests.findAll(status);
    return requests.map(toChangeRequestResponse);
  }

  async updateStatus(id: number, status: ChangeRequestStatus): Promise<ChangeRequestResponse> {
    await this.findOrFail(id);
    await this.changeRequests.updateStatus(id, status);
    return toChangeRequestResponse(await this.findOrFail(id));
  }

  private async findOrFail(id: number): Promise<ChangeRequest> {
    const changeRequest = await this.changeRequests.findById(id);
    if (!changeRequest) throw new NotFoundException('Change request not found.');
    return changeRequest;
  }
}
