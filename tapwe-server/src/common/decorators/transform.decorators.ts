import { Transform } from 'class-transformer';
import { normalizeEmail, normalizePhone } from '../utils/normalize.js';

const whenString = (fn: (v: string) => string) =>
  Transform(({ value }) => (typeof value === 'string' ? fn(value) : value));

export const Trim = () => whenString((v) => v.trim());

export const NormalizeEmail = () => whenString(normalizeEmail);

export const NormalizePhone = () => whenString(normalizePhone);

const emptyToNull = (fn: (v: string) => string) =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.trim() === '' ? null : fn(value);
  });

/** Trims, and turns an empty string into null so optional columns stay empty. */
export const TrimToNull = () => emptyToNull((v) => v.trim());

export const NormalizePhoneOrNull = () => emptyToNull(normalizePhone);
