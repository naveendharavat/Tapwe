import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Card } from './entities/card.entity.js';

export type NewCard = Pick<
  Card,
  'code' | 'name' | 'userId' | 'ownerEmail' | 'status' | 'destinationType' | 'destinationUrl'
>;
export type CardChanges = Partial<Omit<NewCard, 'code'>>;

@Injectable()
export class CardsRepository {
  constructor(@InjectRepository(Card) private readonly base: Repository<Card>) {}

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(Card) : this.base;
  }

  /** Attaches unclaimed cards provisioned for this email to the user. Returns how many were claimed. */
  async claimByEmail(email: string, userId: number, manager?: EntityManager): Promise<number> {
    const result = await this.repo(manager).update({ ownerEmail: email, userId: IsNull() }, { userId });
    return result.affected ?? 0;
  }

  /** Includes soft-deleted cards: a printed code must never be issued twice. */
  codeExists(code: string): Promise<boolean> {
    return this.repo().exists({ where: { code }, withDeleted: true });
  }

  create(data: NewCard): Promise<Card> {
    return this.repo().save(this.repo().create(data));
  }

  findByCode(code: string): Promise<Card | null> {
    return this.repo().findOneBy({ code });
  }

  findOwned(code: string, userId: number): Promise<Card | null> {
    return this.repo().findOneBy({ code, userId });
  }

  findAllForUser(userId: number): Promise<Card[]> {
    return this.repo().find({ where: { userId }, order: { createdAt: 'DESC', code: 'ASC' } });
  }

  async update(code: string, changes: CardChanges): Promise<void> {
    await this.repo().update({ code }, changes);
  }

  async softDelete(code: string): Promise<void> {
    await this.repo().softDelete({ code });
  }
}
