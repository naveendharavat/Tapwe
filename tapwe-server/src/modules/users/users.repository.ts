import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly base: Repository<User>) {}

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(User) : this.base;
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
