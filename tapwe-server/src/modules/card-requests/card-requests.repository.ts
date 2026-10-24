import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardRequest, CardRequestStatus } from './entities/card-request.entity.js';

export type NewCardRequest = Omit<CardRequest, 'id' | 'status' | 'createdAt'>;

@Injectable()
export class CardRequestsRepository {
  constructor(@InjectRepository(CardRequest) private readonly repo: Repository<CardRequest>) {}

  create(data: NewCardRequest): Promise<CardRequest> {
    return this.repo.save(this.repo.create(data));
  }

  findAll(status?: CardRequestStatus): Promise<CardRequest[]> {
    return this.repo.find({ where: status ? { status } : {}, order: { createdAt: 'DESC', id: 'DESC' } });
  }

  findById(id: number): Promise<CardRequest | null> {
    return this.repo.findOneBy({ id });
  }

  async updateStatus(id: number, status: CardRequestStatus): Promise<void> {
    await this.repo.update({ id }, { status });
  }
}
