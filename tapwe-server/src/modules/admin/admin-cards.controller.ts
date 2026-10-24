import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/auth.decorators.js';
import { AdminCardResponse } from '../cards/cards.mapper.js';
import { CardsService } from '../cards/cards.service.js';
import { ListCardsQueryDto } from '../cards/dto/list-cards-query.dto.js';
import { ProvisionCardDto } from '../cards/dto/provision-card.dto.js';
import { UpdateCardDto } from '../cards/dto/update-card.dto.js';

@Roles('admin')
@Controller('admin/cards')
export class AdminCardsController {
  constructor(private readonly cards: CardsService) {}

  @Get()
  list(@Query() query: ListCardsQueryDto): Promise<AdminCardResponse[]> {
    return this.cards.listAll({ status: query.status, search: query.search ?? undefined });
  }

  @Post()
  async provision(@Body() dto: ProvisionCardDto): Promise<AdminCardResponse> {
    return this.cards.toAdminResponse(await this.cards.provision(dto));
  }

  @Patch(':code')
  async update(@Param('code') code: string, @Body() dto: UpdateCardDto): Promise<AdminCardResponse> {
    return this.cards.toAdminResponse(await this.cards.update(code, dto));
  }
}
