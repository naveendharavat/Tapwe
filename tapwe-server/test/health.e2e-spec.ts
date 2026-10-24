import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { api, createTestApp } from './utils/test-app.js';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns ok', async () => {
    await api(app).get('/health').expect(200).expect({ status: 'ok' });
  });
});
