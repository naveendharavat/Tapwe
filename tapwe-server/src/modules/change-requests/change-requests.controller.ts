import { Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { ChangeRequestsService } from './change-requests.service.js';
import { CreateChangeRequestDto } from './dto/create-change-request.dto.js';

@Controller('cards/:code/change-requests')
export class ChangeRequestsController {
  constructor(private readonly changeRequests: ChangeRequestsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('code') code: string,
    @Body() dto: CreateChangeRequestDto,
  ): Promise<{ id: number }> {
    return this.changeRequests.request(code, user.id, dto.message);
  }
}
