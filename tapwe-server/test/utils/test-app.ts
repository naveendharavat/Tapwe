import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { User } from '../../src/modules/users/entities/user.entity.js';
import { configureApp } from '../../src/app.setup.js';

export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  configureApp(app);
  await app.init();
  return app;
}

export function api(app: INestApplication<App>) {
  return request(app.getHttpServer());
}

const PASSWORD = 'secret123';

/** Signs up an owner and returns their bearer token. */
export async function signUpOwner(app: INestApplication<App>, email: string, name = 'Owner'): Promise<string> {
  const res = await api(app).post('/auth/sign-up').send({ name, email, password: PASSWORD }).expect(201);
  return res.body.token as string;
}

/** Creates an admin account and returns its bearer token. */
export async function createAdmin(app: INestApplication<App>, email = 'admin@tapwe.in'): Promise<string> {
  await signUpOwner(app, email, 'Admin');
  await app.get(DataSource).getRepository(User).update({ email }, { role: 'admin' });
  const res = await api(app).post('/auth/sign-in').send({ email, password: PASSWORD }).expect(200);
  return res.body.token as string;
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
