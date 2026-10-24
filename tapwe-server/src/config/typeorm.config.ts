import { DataSourceOptions } from 'typeorm';
import { AppConfig } from './configuration.js';
import { entities } from '../database/entities.js';
import { migrations } from '../database/migrations/index.js';

export function buildTypeOrmOptions(db: AppConfig['db'], isTest: boolean): DataSourceOptions {
  if (isTest && !db.name.endsWith('_test')) {
    throw new Error(`Refusing to rebuild "${db.name}" in test mode: test runs drop the schema, so DB_NAME must end in _test.`);
  }
  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.name,
    // Supabase requires TLS; its certificate is signed by Supabase's own CA, not a public one.
    ssl: db.ssl ? { rejectUnauthorized: false } : false,
    entities,
    migrations,
    synchronize: false,
    // A null in a WHERE would otherwise be dropped and match every row.
    invalidWhereValuesBehavior: { null: 'throw' },
    // The test database is rebuilt from migrations on every app boot.
    dropSchema: isTest,
    migrationsRun: isTest,
  };
}
