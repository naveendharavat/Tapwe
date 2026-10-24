import { Body, Controller, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { UpdateMeDto } from './dto/update-me.dto.js';
import { UserResponse } from './users.mapper.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto): Promise<UserResponse> {
    return this.users.updateMe(user.id, dto);
  }
}
