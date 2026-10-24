import { Module } from '@nestjs/common';
import { CardRequestsModule } from '../card-requests/card-requests.module.js';
import { CardsModule } from '../cards/cards.module.js';
import { ChangeRequestsModule } from '../change-requests/change-requests.module.js';
import { AdminCardRequestsController } from './admin-card-requests.controller.js';
import { AdminCardsController } from './admin-cards.controller.js';
import { AdminChangeRequestsController } from './admin-change-requests.controller.js';

@Module({
  imports: [CardRequestsModule, CardsModule, ChangeRequestsModule],
  controllers: [AdminCardRequestsController, AdminCardsController, AdminChangeRequestsController],
})
export class AdminModule {}
