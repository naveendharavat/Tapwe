import { assertSeedAllowed } from './seed-guard.js';

describe('assertSeedAllowed', () => {
  it('refuses production, where it would create an admin with a published password', () => {
    expect(() => assertSeedAllowed('production')).toThrow(/production/);
  });

  it('allows local development', () => {
    expect(() => assertSeedAllowed(undefined)).not.toThrow();
    expect(() => assertSeedAllowed('development')).not.toThrow();
  });
});
