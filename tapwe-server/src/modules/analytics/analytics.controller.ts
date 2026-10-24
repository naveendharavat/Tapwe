import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { AnalyticsService, AnalyticsSummary } from './analytics.service.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('summary')
  summary(@CurrentUser() user: AuthUser): Promise<AnalyticsSummary> {
    return this.analytics.summary(user.id);
  }
}
