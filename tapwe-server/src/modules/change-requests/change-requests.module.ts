import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from '../cards/cards.module.js';
import { ChangeRequestsController } from './change-requests.controller.js';
import { ChangeRequestsRepository } from './change-requests.repository.js';
import { ChangeRequestsService } from './change-requests.service.js';
import { ChangeRequest } from './entities/change-request.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequest]), CardsModule],
  controllers: [ChangeRequestsController],
  providers: [ChangeRequestsRepository, ChangeRequestsService],
  exports: [ChangeRequestsService],
})
export class ChangeRequestsModule {}
