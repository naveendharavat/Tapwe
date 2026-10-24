import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { CardsModule } from '../cards/cards.module.js';
import { ProfilesModule } from '../profiles/profiles.module.js';
import { PublicController } from './public.controller.js';
import { PublicService } from './public.service.js';

@Module({
  imports: [CardsModule, ProfilesModule, AnalyticsModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
