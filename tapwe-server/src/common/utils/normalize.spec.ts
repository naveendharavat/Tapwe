import { isHttpUrl, normalizeEmail, normalizePhone } from './normalize.js';

describe('isHttpUrl', () => {
  it('accepts http and https links', () => {
    expect(isHttpUrl('https://example.com/menu')).toBe(true);
    expect(isHttpUrl('http://example.com')).toBe(true);
  });

  it('rejects other protocols and non-URLs', () => {
    expect(isHttpUrl('ftp://example.com')).toBe(false);
    expect(isHttpUrl('example.com')).toBe(false);
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Foo@Bar.com ')).toBe('foo@bar.com');
  });
});

describe('normalizePhone', () => {
  it('strips spaces, dashes and the +91 prefix', () => {
    expect(normalizePhone('+91 98765-43210')).toBe('9876543210');
  });

  it('strips a leading 0 trunk prefix', () => {
    expect(normalizePhone('09876543210')).toBe('9876543210');
  });

  it('leaves a plain 10-digit number alone', () => {
    expect(normalizePhone('(987) 654 3210')).toBe('9876543210');
  });
});
