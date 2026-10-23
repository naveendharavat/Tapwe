import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMeDto } from './dto/update-me.dto.js';
import { toUserResponse, UserResponse } from './users.mapper.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async getMe(userId: number): Promise<UserResponse> {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('Account not found.');
    return toUserResponse(user);
  }

  async updateMe(userId: number, dto: UpdateMeDto): Promise<UserResponse> {
    if (dto.email) {
      const owner = await this.users.findByEmail(dto.email);
      if (owner && owner.id !== userId) {
        throw new ConflictException('An account with this email already exists.');
      }
    }
    const user = await this.users.update(userId, { name: dto.name, email: dto.email });
    if (!user) throw new NotFoundException('Account not found.');
    return toUserResponse(user);
  }
}
