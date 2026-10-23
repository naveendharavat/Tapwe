import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/auth.decorators.js';
import { ChangeRequestsService } from '../change-requests/change-requests.service.js';
import {
  ListChangeRequestsQueryDto,
  UpdateChangeRequestStatusDto,
} from '../change-requests/dto/change-request-status.dto.js';
import { ChangeRequest } from '../change-requests/entities/change-request.entity.js';

@Roles('admin')
@Controller('admin/change-requests')
export class AdminChangeRequestsController {
  constructor(private readonly changeRequests: ChangeRequestsService) {}

  @Get()
  list(@Query() query: ListChangeRequestsQueryDto): Promise<ChangeRequest[]> {
    return this.changeRequests.list(query.status);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChangeRequestStatusDto,
  ): Promise<ChangeRequest> {
    return this.changeRequests.updateStatus(id, dto.status);
  }
}
