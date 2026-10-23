import { Controller, Get, Headers, Param } from '@nestjs/common';
import { Public } from '../../common/decorators/auth.decorators.js';
import { PublicCardResponse, PublicService } from './public.service.js';

@Public()
@Controller('public/cards')
export class PublicController {
  constructor(private readonly publicCards: PublicService) {}

  @Get(':code')
  resolve(
    @Param('code') code: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<PublicCardResponse> {
    return this.publicCards.resolve(code.toLowerCase(), userAgent ?? null);
  }
}
