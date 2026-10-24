import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardRequestsController } from './card-requests.controller.js';
import { CardRequestsRepository } from './card-requests.repository.js';
import { CardRequestsService } from './card-requests.service.js';
import { CardRequest } from './entities/card-request.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CardRequest])],
  controllers: [CardRequestsController],
  providers: [CardRequestsRepository, CardRequestsService],
  exports: [CardRequestsService],
})
export class CardRequestsModule {}
