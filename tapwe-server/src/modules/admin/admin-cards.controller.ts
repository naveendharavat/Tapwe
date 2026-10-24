import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/auth.decorators.js';
import { CardsService } from '../cards/cards.service.js';
import { ProvisionCardDto } from '../cards/dto/provision-card.dto.js';
import { UpdateCardDto } from '../cards/dto/update-card.dto.js';
import { Card } from '../cards/entities/card.entity.js';

@Roles('admin')
@Controller('admin/cards')
export class AdminCardsController {
  constructor(private readonly cards: CardsService) {}

  @Post()
  provision(@Body() dto: ProvisionCardDto): Promise<Card> {
    return this.cards.provision(dto);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateCardDto): Promise<Card> {
    return this.cards.update(code, dto);
  }
}
