export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/[\s\-()]/g, '');
  return digits.length > 10 ? digits.replace(/^(\+91|91|0)/, '') : digits;
}

export function isHttpUrl(value: string): boolean {
  try {
    return /^https?:$/.test(new URL(value).protocol);
  } catch {
    return false;
  }
}
