import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity.js';

export type ProfileFields = Pick<Profile, 'businessName' | 'description' | 'phone' | 'website'>;

@Injectable()
export class ProfilesRepository {
  constructor(@InjectRepository(Profile) private readonly base: Repository<Profile>) {}

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(Profile) : this.base;
  }

  async createEmpty(userId: number, manager?: EntityManager): Promise<void> {
    await this.repo(manager).insert({ userId });
  }

  findByUserId(userId: number): Promise<Profile | null> {
    return this.repo().findOneBy({ userId });
  }

  async update(userId: number, fields: Partial<ProfileFields>): Promise<void> {
    await this.repo().update({ userId }, fields);
  }
}
