import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, bearer, createTestApp, signUpOwner } from './utils/test-app.js';

describe('Profile (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    token = await signUpOwner(app, 'profile@cafe.in');
  });

  afterAll(async () => {
    await app.close();
  });

  it('starts empty after sign-up', async () => {
    await api(app)
      .get('/profile')
      .set(bearer(token))
      .expect(200)
      .expect({ businessName: null, description: null, phone: null, website: null });
  });

  it('round-trips a saved profile, normalizing the phone', async () => {
    const body = {
      businessName: 'Your Business',
      description: 'Café · Open until 10 pm',
      phone: '+91 98765 43210',
      website: 'https://cafe.in',
    };
    await api(app).put('/profile').set(bearer(token)).send(body).expect(200);
    await api(app)
      .get('/profile')
      .set(bearer(token))
      .expect(200)
      .expect({ ...body, phone: '9876543210' });
  });

  it('clears a field sent as an empty string', async () => {
    await api(app).put('/profile').set(bearer(token)).send({ website: '' }).expect(200);
    const res = await api(app).get('/profile').set(bearer(token)).expect(200);
    expect(res.body.website).toBeNull();
    expect(res.body.businessName).toBe('Your Business');
  });

  it('rejects a non-http website with the design copy', async () => {
    await api(app)
      .put('/profile')
      .set(bearer(token))
      .send({ website: 'ftp://x' })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Enter a full link starting with https://'));
  });

  it('rejects an invalid phone', async () => {
    await api(app).put('/profile').set(bearer(token)).send({ phone: '12345' }).expect(400);
  });
});
