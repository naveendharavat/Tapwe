import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, bearer, createAdmin, createTestApp, signUpOwner } from './utils/test-app.js';

const validRequest = {
  name: 'Asha Rao',
  businessName: 'Blue Tokai Café',
  email: 'asha@cafe.in',
  phone: '+91 98765 43210',
  businessType: 'Restaurant or café',
  quantity: '2 to 5',
  destinations: ['Menu', 'Feedback form'],
  city: 'Hyderabad',
  note: '',
  agreed: true,
};

describe('Card requests (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    adminToken = await createAdmin(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts a valid public request without signing in', async () => {
    const res = await api(app).post('/card-requests').send(validRequest).expect(201);
    expect(res.body.id).toEqual(expect.any(Number));
  });

  it('rejects an invalid phone with the design copy', async () => {
    await api(app)
      .post('/card-requests')
      .send({ ...validRequest, phone: '12345' })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Enter a valid 10-digit mobile number.'));
  });

  it('requires the contact consent', async () => {
    await api(app)
      .post('/card-requests')
      .send({ ...validRequest, agreed: false })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Please confirm to continue.'));
  });

  it('requires at least one destination', async () => {
    await api(app)
      .post('/card-requests')
      .send({ ...validRequest, destinations: [] })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Choose at least one option.'));
  });

  it('allows the same email to request twice', async () => {
    await api(app).post('/card-requests').send({ ...validRequest, email: 'repeat@cafe.in' }).expect(201);
    await api(app).post('/card-requests').send({ ...validRequest, email: 'repeat@cafe.in' }).expect(201);
  });

  it('lets an admin list requests newest first with the normalized phone, and update status', async () => {
    const list = await api(app).get('/admin/card-requests').set(bearer(adminToken)).expect(200);
    expect(list.body.length).toBeGreaterThanOrEqual(3);
    expect(list.body[0].phone).toBe('9876543210');
    expect(list.body[0].note).toBeNull();

    const id = list.body[0].id;
    await api(app)
      .patch(`/admin/card-requests/${id}`)
      .set(bearer(adminToken))
      .send({ status: 'contacted' })
      .expect(200)
      .expect((r) => expect(r.body.status).toBe('contacted'));

    const filtered = await api(app).get('/admin/card-requests?status=contacted').set(bearer(adminToken)).expect(200);
    expect(filtered.body.map((r: { id: number }) => r.id)).toEqual([id]);
  });

  it('forbids owners from the admin list', async () => {
    const ownerToken = await signUpOwner(app, 'owner@cafe.in');
    await api(app).get('/admin/card-requests').set(bearer(ownerToken)).expect(403);
  });
});
