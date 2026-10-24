import { Injectable, NotFoundException } from '@nestjs/common';
import { CardRequestsRepository } from './card-requests.repository.js';
import { CreateCardRequestDto } from './dto/create-card-request.dto.js';
import { CardRequest, CardRequestStatus } from './entities/card-request.entity.js';

@Injectable()
export class CardRequestsService {
  constructor(private readonly requests: CardRequestsRepository) {}

  async submit(dto: CreateCardRequestDto): Promise<{ id: number }> {
    const { id } = await this.requests.create({
      name: dto.name,
      businessName: dto.businessName,
      email: dto.email,
      phone: dto.phone,
      businessType: dto.businessType,
      quantity: dto.quantity,
      destinations: dto.destinations,
      city: dto.city ?? null,
      note: dto.note ?? null,
      agreed: dto.agreed,
    });
    return { id };
  }

  list(status?: CardRequestStatus): Promise<CardRequest[]> {
    return this.requests.findAll(status);
  }

  async updateStatus(id: number, status: CardRequestStatus): Promise<CardRequest> {
    await this.findOrFail(id);
    await this.requests.updateStatus(id, status);
    return this.findOrFail(id);
  }

  private async findOrFail(id: number): Promise<CardRequest> {
    const request = await this.requests.findById(id);
    if (!request) throw new NotFoundException('Card request not found.');
    return request;
  }
}
