import { Body, Controller, Get, Put } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileResponse } from './profiles.mapper.js';
import { ProfilesService } from './profiles.service.js';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get()
  get(@CurrentUser() user: AuthUser): Promise<ProfileResponse> {
    return this.profiles.get(user.id);
  }

  @Put()
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto): Promise<ProfileResponse> {
    return this.profiles.update(user.id, dto);
  }
}
