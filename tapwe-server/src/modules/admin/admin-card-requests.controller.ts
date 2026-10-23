import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/auth.decorators.js';
import { CardRequestsService } from '../card-requests/card-requests.service.js';
import { ListCardRequestsQueryDto } from '../card-requests/dto/list-card-requests-query.dto.js';
import { UpdateCardRequestStatusDto } from '../card-requests/dto/update-card-request-status.dto.js';
import { CardRequest } from '../card-requests/entities/card-request.entity.js';

@Roles('admin')
@Controller('admin/card-requests')
export class AdminCardRequestsController {
  constructor(private readonly requests: CardRequestsService) {}

  @Get()
  list(@Query() query: ListCardRequestsQueryDto): Promise<CardRequest[]> {
    return this.requests.list(query.status);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCardRequestStatusDto,
  ): Promise<CardRequest> {
    return this.requests.updateStatus(id, dto.status);
  }
}
