import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, createTestApp } from './utils/test-app.js';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signs up, then reads /auth/me with the returned token', async () => {
    const res = await api(app)
      .post('/auth/sign-up')
      .send({ name: 'Asha', email: ' Asha@Cafe.in ', password: 'secret123' })
      .expect(201);
    expect(res.body.user).toMatchObject({ name: 'Asha', email: 'asha@cafe.in', role: 'owner' });

    await api(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${res.body.token}`)
      .expect(200)
      .expect((r) => expect(r.body.email).toBe('asha@cafe.in'));
  });

  it('rejects /auth/me without a token', async () => {
    await api(app).get('/auth/me').expect(401);
  });

  it('returns 409 for a duplicate email', async () => {
    const body = { name: 'Dup', email: 'dup@cafe.in', password: 'secret123' };
    await api(app).post('/auth/sign-up').send(body).expect(201);
    await api(app)
      .post('/auth/sign-up')
      .send(body)
      .expect(409)
      .expect((r) => expect(r.body.message).toBe('An account with this email already exists.'));
  });

  it('rejects a 7-character password with the design copy', async () => {
    await api(app)
      .post('/auth/sign-up')
      .send({ name: 'Short', email: 'short@cafe.in', password: '1234567' })
      .expect(400)
      .expect((r) => expect(r.body.message).toContain('Use at least 8 characters.'));
  });

  it('signs in and updates the account name via PATCH /users/me', async () => {
    await api(app).post('/auth/sign-up').send({ name: 'Ravi', email: 'ravi@shop.in', password: 'secret123' });
    const signIn = await api(app)
      .post('/auth/sign-in')
      .send({ email: 'RAVI@shop.in', password: 'secret123' })
      .expect(200);

    await api(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${signIn.body.token}`)
      .send({ name: 'Ravi Kumar' })
      .expect(200)
      .expect((r) => expect(r.body.name).toBe('Ravi Kumar'));
  });

  it('rejects a wrong password with 401', async () => {
    await api(app)
      .post('/auth/sign-in')
      .send({ email: 'ravi@shop.in', password: 'wrongpass1' })
      .expect(401)
      .expect((r) => expect(r.body.message).toBe('Incorrect email or password.'));
  });
});
