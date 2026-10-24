import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { DataSource } from 'typeorm';
import { addDays, toIndiaDate } from '../src/common/utils/india-date.js';
import { TapEvent } from '../src/modules/analytics/entities/tap-event.entity.js';
import { api, bearer, createAdmin, createTestApp, signUpOwner } from './utils/test-app.js';

describe('Public card resolution + analytics (e2e)', () => {
  let app: INestApplication<App>;
  let admin: string;
  let owner: string;

  const provision = async (body: Record<string, unknown>): Promise<string> => {
    const res = await api(app)
      .post('/admin/cards')
      .set(bearer(admin))
      .send({ ownerEmail: 'tap@cafe.in', ...body })
      .expect(201);
    return res.body.code as string;
  };
  const tapsTotal = async (): Promise<number> => {
    const res = await api(app).get('/analytics/summary').set(bearer(owner)).expect(200);
    return res.body.totals.taps as number;
  };

  beforeAll(async () => {
    app = await createTestApp();
    admin = await createAdmin(app);
    owner = await signUpOwner(app, 'tap@cafe.in');
    await api(app)
      .put('/profile')
      .set(bearer(owner))
      .send({ businessName: 'Your Business', description: 'Café · Open until 10 pm' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('redirects an active link card and counts the tap', async () => {
    const code = await provision({
      name: 'Menu',
      status: 'active',
      destinationType: 'menu',
      destinationUrl: 'https://example.com/menu',
    });
    await api(app)
      .get(`/public/cards/${code}`)
      .expect(200)
      .expect({ state: 'redirect', url: 'https://example.com/menu' });
    expect(await tapsTotal()).toBe(1);
  });

  it('serves the owner’s profile for an active profile card', async () => {
    const code = await provision({ name: 'Front desk', status: 'active', destinationType: 'profile' });
    const res = await api(app).get(`/public/cards/${code}`).expect(200);
    expect(res.body).toEqual({
      state: 'profile',
      profile: { businessName: 'Your Business', description: 'Café · Open until 10 pm', phone: null, website: null },
    });
    expect(await tapsTotal()).toBe(2);
  });

  it('reports a paused card as inactive without counting a tap', async () => {
    const code = await provision({ name: 'Paused', status: 'paused', destinationType: 'profile' });
    await api(app).get(`/public/cards/${code}`).expect(200).expect({ state: 'inactive' });
    expect(await tapsTotal()).toBe(2);
  });

  it('returns 404 for deleted and unknown cards', async () => {
    const code = await provision({ name: 'Gone', status: 'active', destinationType: 'profile' });
    await api(app).delete(`/cards/${code}`).set(bearer(owner)).expect(204);
    await api(app).get(`/public/cards/${code}`).expect(404);
    await api(app).get('/public/cards/zzzzzz').expect(404);
    expect(await tapsTotal()).toBe(2);
  });

  it('summarizes the owner’s cards and the last 7 days', async () => {
    const res = await api(app).get('/analytics/summary').set(bearer(owner)).expect(200);
    expect(res.body.perDay).toHaveLength(7);
    expect(res.body.totals).toEqual({ cards: 3, active: 2, drafts: 0, taps: 2 });
  });

  it('buckets taps by IST calendar day and skips taps before the window', async () => {
    const code = await provision({ name: 'Edges', status: 'active', destinationType: 'profile' });
    const today = toIndiaDate(new Date());
    const from = addDays(today, -6);
    const istMidnight = (date: string) => Date.parse(`${date}T00:00:00+05:30`);
    await app
      .get(DataSource)
      .getRepository(TapEvent)
      .insert([
        { cardCode: code, happenedAt: new Date(istMidnight(from) - 60_000) },
        { cardCode: code, happenedAt: new Date(istMidnight(from) + 60_000) },
        { cardCode: code, happenedAt: new Date(istMidnight(today) + 30 * 60_000) },
      ]);

    const res = await api(app).get('/analytics/summary').set(bearer(owner)).expect(200);
    expect(res.body.perDay[0]).toEqual({ date: from, count: 1 });
    expect(res.body.perDay[6]).toEqual({ date: today, count: 3 });
    expect(res.body.totals.taps).toBe(4);
  });
});
