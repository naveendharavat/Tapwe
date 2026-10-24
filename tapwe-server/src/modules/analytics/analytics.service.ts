import { Inject, Injectable } from '@nestjs/common';
import { addDays, toIndiaDate } from '../../common/utils/india-date.js';
import { CardsRepository } from '../cards/cards.repository.js';
import { DailyCount, TapEventsRepository } from './tap-events.repository.js';

export const CLOCK = Symbol('CLOCK');
const WINDOW_DAYS = 7;

export interface AnalyticsSummary {
  perDay: DailyCount[];
  totals: { cards: number; active: number; drafts: number; taps: number };
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly taps: TapEventsRepository,
    private readonly cards: CardsRepository,
    @Inject(CLOCK) private readonly now: () => Date,
  ) {}

  async summary(userId: number): Promise<AnalyticsSummary> {
    const today = toIndiaDate(this.now());
    const from = addDays(today, -(WINDOW_DAYS - 1));
    const [counts, cards] = await Promise.all([
      this.taps.countPerDay(userId, from),
      this.cards.findAllForUser(userId),
    ]);

    const byDate = new Map(counts.map((c) => [c.date, c.count]));
    const perDay = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const date = addDays(from, i);
      return { date, count: byDate.get(date) ?? 0 };
    });

    return {
      perDay,
      totals: {
        cards: cards.length,
        active: cards.filter((c) => c.status === 'active').length,
        drafts: cards.filter((c) => c.status === 'draft').length,
        taps: perDay.reduce((sum, d) => sum + d.count, 0),
      },
    };
  }
}
