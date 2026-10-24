import { buildTypeOrmOptions } from './typeorm.config.js';

const db = { host: 'localhost', port: 3306, user: 'tapwe', password: 'tapwe', name: 'tapwe' };

describe('buildTypeOrmOptions', () => {
  it('refuses to drop a database that is not a test database', () => {
    expect(() => buildTypeOrmOptions(db, true)).toThrow(/tapwe_test|_test/);
  });

  it('rebuilds a *_test database in test mode', () => {
    expect(buildTypeOrmOptions({ ...db, name: 'tapwe_test' }, true)).toMatchObject({ dropSchema: true, migrationsRun: true });
  });

  it('never drops the schema outside test mode', () => {
    expect(buildTypeOrmOptions(db, false)).toMatchObject({ dropSchema: false, migrationsRun: false });
  });
});
