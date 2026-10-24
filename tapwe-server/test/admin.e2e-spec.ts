import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, bearer, createAdmin, createTestApp, signUpOwner } from './utils/test-app.js';

describe('Admin (e2e)', () => {
  let app: INestApplication<App>;
  let admin: string;
  let owner: string;

  const provision = (body: Record<string, unknown>) =>
    api(app).post('/admin/cards').set(bearer(admin)).send(body).expect(201);

  beforeAll(async () => {
    app = await createTestApp();
    admin = await createAdmin(app);
    owner = await signUpOwner(app, 'owner@cafe.in');
    await provision({ name: 'Table menu', ownerEmail: 'owner@cafe.in', status: 'active', destinationType: 'menu', destinationUrl: 'https://cafe.in/menu' });
    await provision({ name: 'Salon desk', ownerEmail: 'new@salon.in', destinationType: 'profile' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists every card with its owner, claim state and public URL, newest first', async () => {
    const res = await api(app).get('/admin/cards').set(bearer(admin)).expect(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ name: 'Salon desk', ownerEmail: 'new@salon.in', claimed: false, status: 'draft' });
    expect(res.body[1]).toMatchObject({
      name: 'Table menu',
      ownerEmail: 'owner@cafe.in',
      claimed: true,
      status: 'active',
      destinationType: 'menu',
      destinationUrl: 'https://cafe.in/menu',
      url: `http://localhost:5173/c/${res.body[1].code}`,
    });
    expect(res.body[1]).not.toHaveProperty('userId');
  });

  it('filters cards by status and by a search over name, code and owner email', async () => {
    const active = await api(app).get('/admin/cards?status=active').set(bearer(admin)).expect(200);
    expect(active.body.map((c: { name: string }) => c.name)).toEqual(['Table menu']);

    const byEmail = await api(app).get('/admin/cards?search=SALON').set(bearer(admin)).expect(200);
    expect(byEmail.body.map((c: { name: string }) => c.name)).toEqual(['Salon desk']);

    const code = active.body[0].code as string;
    const byCode = await api(app).get(`/admin/cards?search=${code}`).set(bearer(admin)).expect(200);
    expect(byCode.body.map((c: { code: string }) => c.code)).toEqual([code]);

    await api(app).get('/admin/cards?status=lost').set(bearer(admin)).expect(400);
  });

  it('returns the admin card shape when creating and editing a card', async () => {
    const created = await provision({ name: 'Feedback', destinationType: 'form', destinationUrl: 'https://forms.cafe.in' });
    expect(created.body).toMatchObject({ name: 'Feedback', ownerEmail: null, claimed: false, url: expect.stringContaining('/c/') });

    const edited = await api(app)
      .patch(`/admin/cards/${created.body.code}`)
      .set(bearer(admin))
      .send({ ownerEmail: 'owner@cafe.in', status: 'active' })
      .expect(200);
    expect(edited.body).toMatchObject({ ownerEmail: 'owner@cafe.in', claimed: true, status: 'active' });
  });

  it('includes the card name in change requests', async () => {
    const [menu] = (await api(app).get('/cards').set(bearer(owner)).expect(200)).body as Array<{ code: string }>;
    await api(app).post(`/cards/${menu.code}/change-requests`).set(bearer(owner)).send({ message: 'New menu link' }).expect(201);

    const res = await api(app).get('/admin/change-requests').set(bearer(admin)).expect(200);
    expect(res.body[0]).toMatchObject({ cardCode: menu.code, cardName: expect.any(String), message: 'New menu link', status: 'open' });
  });

  it('keeps every admin route closed to owners', async () => {
    for (const path of ['/admin/cards', '/admin/card-requests', '/admin/change-requests']) {
      await api(app).get(path).set(bearer(owner)).expect(403);
    }
  });
});
