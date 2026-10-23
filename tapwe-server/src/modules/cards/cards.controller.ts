import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { CardResponse } from './cards.mapper.js';
import { CardsService } from './cards.service.js';

@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<CardResponse[]> {
    return this.cards.listForOwner(user.id);
  }

  @Get(':code')
  get(@CurrentUser() user: AuthUser, @Param('code') code: string): Promise<CardResponse> {
    return this.cards.getForOwner(code, user.id);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthUser, @Param('code') code: string): Promise<void> {
    return this.cards.deleteForOwner(code, user.id);
  }
}
