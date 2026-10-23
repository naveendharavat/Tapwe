import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from '../cards/cards.module.js';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService, CLOCK } from './analytics.service.js';
import { TapEvent } from './entities/tap-event.entity.js';
import { TapEventsRepository } from './tap-events.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([TapEvent]), CardsModule],
  controllers: [AnalyticsController],
  providers: [TapEventsRepository, AnalyticsService, { provide: CLOCK, useValue: () => new Date() }],
  exports: [TapEventsRepository],
})
export class AnalyticsModule {}
