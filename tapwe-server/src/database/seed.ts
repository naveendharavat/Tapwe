import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module.js';
import { addDays, toIndiaDate } from '../common/utils/india-date.js';
import { TapEvent } from '../modules/analytics/entities/tap-event.entity.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { CardsRepository } from '../modules/cards/cards.repository.js';
import { ProfilesRepository } from '../modules/profiles/profiles.repository.js';
import { User } from '../modules/users/entities/user.entity.js';
import { assertSeedAllowed } from './seed-guard.js';

const ADMIN = { name: 'Tapwe Admin', email: 'admin@tapwe.in', password: 'admin12345' };
const DEMO = { name: 'Demo User', email: 'demo@tapwe.in', password: 'demo12345' };
// Opens per day for the last 7 days, oldest first (the design's sample week).
const SAMPLE_WEEK = [12, 18, 9, 24, 30, 38, 21];

async function seed(): Promise<void> {
  assertSeedAllowed(process.env.NODE_ENV);
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  try {
    const dataSource = app.get(DataSource);
    const users = dataSource.getRepository(User);
    if (await users.existsBy({ email: ADMIN.email })) {
      console.log('Seed data already present, nothing to do.');
      return;
    }

    const auth = app.get(AuthService);
    await auth.signUp(ADMIN);
    await users.update({ email: ADMIN.email }, { role: 'admin' });
    const { user: demo } = await auth.signUp(DEMO);

    await app.get(ProfilesRepository).update(demo.id, {
      businessName: 'Your Business',
      description: 'Café · Open until 10 pm',
      phone: '9876543210',
      website: 'https://example.com',
    });

    const cards = app.get(CardsRepository);
    const owned = { userId: demo.id, ownerEmail: demo.email };
    await cards.create({ ...owned, code: 'ab12cd', name: 'Front desk card', status: 'active', destinationType: 'profile', destinationUrl: null });
    await cards.create({ ...owned, code: 'k9f2xq', name: 'Table menu', status: 'active', destinationType: 'menu', destinationUrl: 'https://example.com/menu' });
    await cards.create({ ...owned, code: 'm4t8zr', name: 'Feedback card', status: 'draft', destinationType: 'form', destinationUrl: 'https://forms.example.com/feedback' });

    const firstDay = addDays(toIndiaDate(new Date()), -(SAMPLE_WEEK.length - 1));
    const taps = SAMPLE_WEEK.flatMap((count, i) =>
      Array.from({ length: count }, (_, n) => ({
        cardCode: n % 2 ? 'k9f2xq' : 'ab12cd',
        // Noon IST on that day, spread a minute apart.
        happenedAt: new Date(Date.parse(`${addDays(firstDay, i)}T06:30:00Z`) + n * 60_000),
        userAgent: 'seed',
      })),
    );
    await dataSource.getRepository(TapEvent).insert(taps);

    console.log(`Seeded admin ${ADMIN.email} / ${ADMIN.password}`);
    console.log(`Seeded owner ${DEMO.email} / ${DEMO.password} with 3 cards and ${taps.length} taps`);
  } finally {
    await app.close();
  }
}

await seed();
