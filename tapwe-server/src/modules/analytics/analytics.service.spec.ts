import { CardsRepository } from '../cards/cards.repository.js';
import { TapEventsRepository } from './tap-events.repository.js';
import { AnalyticsService } from './analytics.service.js';

function makeService(dailyCounts: { date: string; count: number }[]) {
  const taps = { countPerDay: vi.fn().mockResolvedValue(dailyCounts) };
  const cards = {
    findAllForUser: vi.fn().mockResolvedValue([
      { status: 'active' },
      { status: 'active' },
      { status: 'draft' },
      { status: 'paused' },
    ]),
  };
  // 2026-10-23 at 02:00 in India (still 2026-10-22 in UTC).
  const now = () => new Date('2026-10-22T20:30:00Z');
  const service = new AnalyticsService(
    taps as unknown as TapEventsRepository,
    cards as unknown as CardsRepository,
    now,
  );
  return { service, taps };
}

describe('AnalyticsService.summary', () => {
  it('returns 7 India-time days ending today, oldest first, zero-filled', async () => {
    const { service, taps } = makeService([
      { date: '2026-10-18', count: 4 },
      { date: '2026-10-23', count: 2 },
    ]);
    const summary = await service.summary(1);

    expect(summary.perDay.map((d) => d.date)).toEqual([
      '2026-10-17',
      '2026-10-18',
      '2026-10-19',
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
    ]);
    expect(summary.perDay.map((d) => d.count)).toEqual([0, 4, 0, 0, 0, 0, 2]);
    expect(taps.countPerDay).toHaveBeenCalledWith(1, '2026-10-17');
  });

  it('totals cards by status and taps over the week', async () => {
    const { service } = makeService([{ date: '2026-10-20', count: 5 }]);
    const { totals } = await service.summary(1);
    expect(totals).toEqual({ cards: 4, active: 2, drafts: 1, taps: 5 });
  });
});
