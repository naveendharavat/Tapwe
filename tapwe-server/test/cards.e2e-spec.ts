import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, bearer, createAdmin, createTestApp, signUpOwner } from './utils/test-app.js';

describe('Cards (e2e)', () => {
  let app: INestApplication<App>;
  let admin: string;
  let ownerA: string;
  let ownerB: string;

  const provision = (body: Record<string, unknown>) =>
    api(app).post('/admin/cards').set(bearer(admin)).send(body);

  beforeAll(async () => {
    app = await createTestApp();
    admin = await createAdmin(app);
    ownerA = await signUpOwner(app, 'a@cafe.in', 'Owner A');
    ownerB = await signUpOwner(app, 'b@shop.in', 'Owner B');
  });

  afterAll(async () => {
    await app.close();
  });

  it('provisions a card for an existing owner, who then sees it with its URL and label', async () => {
    const res = await provision({
      name: 'Table menu',
      ownerEmail: 'A@Cafe.in',
      status: 'active',
      destinationType: 'menu',
      destinationUrl: 'https://example.com/menu',
    }).expect(201);
    expect(res.body.code).toMatch(/^[a-z0-9]{6}$/);

    const list = await api(app).get('/cards').set(bearer(ownerA)).expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({
      code: res.body.code,
      name: 'Table menu',
      status: 'active',
      destinationType: 'menu',
      destinationLabel: 'https://example.com/menu',
      url: `http://localhost:5173/c/${res.body.code}`,
    });
  });

  it('attaches a card provisioned before sign-up once the owner signs up', async () => {
    const res = await provision({ name: 'Front desk', ownerEmail: 'later@salon.in', destinationType: 'profile' }).expect(201);
    const later = await signUpOwner(app, '  Later@Salon.in ', 'Later');
    const list = await api(app).get('/cards').set(bearer(later)).expect(200);
    expect(list.body.map((c: { code: string }) => c.code)).toEqual([res.body.code]);
    expect(list.body[0].destinationLabel).toBe('Digital profile');
  });

  it('hides another owner’s card behind a 404', async () => {
    const { body: card } = await provision({ name: 'B only', ownerEmail: 'b@shop.in', destinationType: 'profile' });
    await api(app).get(`/cards/${card.code}`).set(bearer(ownerA)).expect(404);
    await api(app).delete(`/cards/${card.code}`).set(bearer(ownerA)).expect(404);
    await api(app)
      .post(`/cards/${card.code}/change-requests`)
      .set(bearer(ownerA))
      .send({ message: 'Point to our new menu' })
      .expect(404);
    await api(app).get(`/cards/${card.code}`).set(bearer(ownerB)).expect(200);
  });

  it('records a change request for the owner’s own card', async () => {
    const { body: card } = await provision({ name: 'Feedback', ownerEmail: 'b@shop.in', destinationType: 'profile' });
    await api(app)
      .post(`/cards/${card.code}/change-requests`)
      .set(bearer(ownerB))
      .send({ message: 'Open our Google review page instead' })
      .expect(201);
    await api(app)
      .post(`/cards/${card.code}/change-requests`)
      .set(bearer(ownerB))
      .send({ message: '   ' })
      .expect(400);
  });

  it('lets an admin list open change requests and mark them done', async () => {
    const { body: card } = await provision({ name: 'Needs change', ownerEmail: 'b@shop.in', destinationType: 'profile' });
    await api(app)
      .post(`/cards/${card.code}/change-requests`)
      .set(bearer(ownerB))
      .send({ message: 'Point to our Diwali offer page' })
      .expect(201);

    const open = await api(app).get('/admin/change-requests?status=open').set(bearer(admin)).expect(200);
    const mine = open.body.find((r: { cardCode: string }) => r.cardCode === card.code);
    expect(mine).toMatchObject({ message: 'Point to our Diwali offer page', status: 'open' });

    await api(app)
      .patch(`/admin/change-requests/${mine.id}`)
      .set(bearer(admin))
      .send({ status: 'done' })
      .expect(200)
      .expect((r) => expect(r.body.status).toBe('done'));

    const stillOpen = await api(app).get('/admin/change-requests?status=open').set(bearer(admin)).expect(200);
    expect(stillOpen.body.map((r: { id: number }) => r.id)).not.toContain(mine.id);
    await api(app).get('/admin/change-requests').set(bearer(ownerB)).expect(403);
  });

  it('soft-deletes a card so it leaves the list', async () => {
    const { body: card } = await provision({ name: 'Temp', ownerEmail: 'b@shop.in', destinationType: 'profile' });
    await api(app).delete(`/cards/${card.code}`).set(bearer(ownerB)).expect(204);
    await api(app).get(`/cards/${card.code}`).set(bearer(ownerB)).expect(404);
    const list = await api(app).get('/cards').set(bearer(ownerB)).expect(200);
    expect(list.body.map((c: { code: string }) => c.code)).not.toContain(card.code);
  });

  it('requires an http(s) link for non-profile destinations', async () => {
    await provision({ name: 'No link', destinationType: 'url' })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Enter a full link starting with https://'));
    await provision({ name: 'Bad link', destinationType: 'url', destinationUrl: 'ftp://x.in' }).expect(400);
  });

  it('lets an admin rename and repoint a card', async () => {
    const { body: card } = await provision({ name: 'Old name', ownerEmail: 'a@cafe.in', destinationType: 'profile' });
    await api(app)
      .patch(`/admin/cards/${card.code}`)
      .set(bearer(admin))
      .send({ name: 'New name', destinationType: 'url', destinationUrl: 'https://cafe.in' })
      .expect(200)
      .expect((r) => expect(r.body).toMatchObject({ name: 'New name', destinationUrl: 'https://cafe.in' }));
  });

  it('unassigns a card when an admin clears its owner, instead of giving it to another user', async () => {
    const { body: card } = await provision({ name: 'Transfer me', ownerEmail: 'a@cafe.in', destinationType: 'profile' });
    await api(app)
      .patch(`/admin/cards/${card.code}`)
      .set(bearer(admin))
      .send({ ownerEmail: null })
      .expect(200)
      .expect((r) => expect(r.body).toMatchObject({ ownerEmail: null, userId: null }));
  });

  it('forbids owners from provisioning', async () => {
    await api(app).post('/admin/cards').set(bearer(ownerA)).send({ name: 'x', destinationType: 'profile' }).expect(403);
  });
});
