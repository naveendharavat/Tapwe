import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IST_OFFSET } from '../../common/utils/india-date.js';
import { TapEvent } from './entities/tap-event.entity.js';

export interface DailyCount {
  date: string;
  count: number;
}

@Injectable()
export class TapEventsRepository {
  constructor(@InjectRepository(TapEvent) private readonly repo: Repository<TapEvent>) {}

  async record(cardCode: string, userAgent: string | null): Promise<void> {
    await this.repo.insert({ cardCode, userAgent: userAgent?.slice(0, 300) ?? null });
  }

  /** Taps on the user's cards per IST day, from `fromDate` (inclusive) onward. */
  async countPerDay(userId: number, fromDate: string): Promise<DailyCount[]> {
    const ist = `INTERVAL '${IST_OFFSET}'`;
    const day = `to_char(tap.happened_at AT TIME ZONE ${ist}, 'YYYY-MM-DD')`;
    const rows = await this.repo
      .createQueryBuilder('tap')
      .innerJoin('tap.card', 'card')
      .select(day, 'date')
      .addSelect('COUNT(*)', 'count')
      .where('card.userId = :userId', { userId })
      .andWhere(`tap.happened_at >= CAST(:fromDate AS timestamp) AT TIME ZONE ${ist}`, { fromDate })
      .groupBy(day)
      .getRawMany<{ date: string; count: string }>();
    return rows.map((row) => ({ date: row.date, count: Number(row.count) }));
  }
}
