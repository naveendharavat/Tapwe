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
    const day = `DATE(CONVERT_TZ(tap.happened_at, '+00:00', '${IST_OFFSET}'))`;
    const rows = await this.repo
      .createQueryBuilder('tap')
      .innerJoin('tap.card', 'card')
      .select(`DATE_FORMAT(${day}, '%Y-%m-%d')`, 'date')
      .addSelect('COUNT(*)', 'count')
      .where('card.userId = :userId', { userId })
      .andWhere(`${day} >= :fromDate`, { fromDate })
      .groupBy('date')
      .getRawMany<{ date: string; count: string }>();
    return rows.map((row) => ({ date: row.date, count: Number(row.count) }));
  }
}
