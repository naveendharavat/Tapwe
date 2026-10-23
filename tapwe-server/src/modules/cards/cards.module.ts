import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateCardCode } from '../../common/utils/card-code.js';
import { ProfilesModule } from '../profiles/profiles.module.js';
import { UsersModule } from '../users/users.module.js';
import { CardsController } from './cards.controller.js';
import { CardsRepository } from './cards.repository.js';
import { CARD_CODE_GENERATOR, CardsService } from './cards.service.js';
import { Card } from './entities/card.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), UsersModule, ProfilesModule],
  controllers: [CardsController],
  providers: [
    CardsRepository,
    CardsService,
    { provide: CARD_CODE_GENERATOR, useValue: () => generateCardCode() },
  ],
  exports: [CardsRepository, CardsService],
})
export class CardsModule {}
