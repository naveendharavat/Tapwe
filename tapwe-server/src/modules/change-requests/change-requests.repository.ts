import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequest, ChangeRequestStatus } from './entities/change-request.entity.js';

@Injectable()
export class ChangeRequestsRepository {
  constructor(@InjectRepository(ChangeRequest) private readonly repo: Repository<ChangeRequest>) {}

  create(cardCode: string, message: string): Promise<ChangeRequest> {
    return this.repo.save(this.repo.create({ cardCode, message }));
  }

  findAll(status?: ChangeRequestStatus): Promise<ChangeRequest[]> {
    return this.repo.find({ where: status ? { status } : {}, order: { createdAt: 'DESC', id: 'DESC' } });
  }

  findById(id: number): Promise<ChangeRequest | null> {
    return this.repo.findOneBy({ id });
  }

  async updateStatus(id: number, status: ChangeRequestStatus): Promise<void> {
    await this.repo.update({ id }, { status });
  }
}
