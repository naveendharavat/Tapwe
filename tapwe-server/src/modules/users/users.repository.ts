import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity.js';
import { Profile } from '../profiles/entities/profile.entity.js';
import { User, UserRole } from './entities/user.entity.js';

export interface UserWithStats {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  businessName: string | null;
  phone: string | null;
  cardCount: number;
  createdAt: Date;
}

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly base: Repository<User>) {}

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(User) : this.base;
  }

  /** Every account, newest first, with its profile contact details and how many live cards it owns. */
  async findAllWithStats(): Promise<UserWithStats[]> {
    const rows = await this.repo()
      .createQueryBuilder('user')
      .leftJoin(Profile, 'profile', 'profile.userId = user.id')
      .leftJoin(Card, 'card', 'card.userId = user.id AND card.deletedAt IS NULL')
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email')
      .addSelect('user.role', 'role')
      .addSelect('profile.businessName', 'businessName')
      .addSelect('profile.phone', 'phone')
      .addSelect('COUNT(card.code)', 'cardCount')
      .addSelect('user.createdAt', 'createdAt')
      .groupBy('user.id')
      .addGroupBy('profile.id')
      .orderBy('user.createdAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .getRawMany<Omit<UserWithStats, 'cardCount'> & { cardCount: string }>();
    return rows.map((row) => ({ ...row, cardCount: Number(row.cardCount) }));
  }

  findById(id: number): Promise<User | null> {
    return this.repo().findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo().findOneBy({ email });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo()
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(data: Pick<User, 'name' | 'email' | 'passwordHash'> & Partial<Pick<User, 'role'>>, manager?: EntityManager): Promise<User> {
    return this.repo(manager).save(this.repo(manager).create(data));
  }

  async update(id: number, changes: Partial<Pick<User, 'name' | 'email'>>): Promise<User | null> {
    await this.repo().update({ id }, changes);
    return this.findById(id);
  }
}
