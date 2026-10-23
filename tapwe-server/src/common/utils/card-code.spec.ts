import { generateCardCode } from './card-code.js';

describe('generateCardCode', () => {
  it('returns 6 lowercase base36 characters', () => {
    for (let i = 0; i < 200; i++) {
      expect(generateCardCode()).toMatch(/^[a-z0-9]{6}$/);
    }
  });

  it('is deterministic for a given random source', () => {
    expect(generateCardCode(() => 0)).toBe('000000');
  });
});
