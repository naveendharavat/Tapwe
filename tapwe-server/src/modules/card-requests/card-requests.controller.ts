import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/auth.decorators.js';
import { CardRequestsService } from './card-requests.service.js';
import { CreateCardRequestDto } from './dto/create-card-request.dto.js';

@Controller('card-requests')
export class CardRequestsController {
  constructor(private readonly requests: CardRequestsService) {}

  @Public()
  @Post()
  submit(@Body() dto: CreateCardRequestDto): Promise<{ id: number }> {
    return this.requests.submit(dto);
  }
}
