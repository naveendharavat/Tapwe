import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileResponse, toProfileResponse } from './profiles.mapper.js';
import { ProfilesRepository } from './profiles.repository.js';

@Injectable()
export class ProfilesService {
  constructor(private readonly profiles: ProfilesRepository) {}

  async get(userId: number): Promise<ProfileResponse> {
    return toProfileResponse(await this.profiles.findByUserId(userId));
  }

  async update(userId: number, dto: UpdateProfileDto): Promise<ProfileResponse> {
    const fields = Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined));
    if (Object.keys(fields).length) await this.profiles.update(userId, fields);
    return this.get(userId);
  }
}
