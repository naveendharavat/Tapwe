/** Tapwe's customers are in India, so "a day" for analytics is an IST calendar day. */
export const IST_OFFSET = '+05:30';
const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** `YYYY-MM-DD` of the IST calendar day containing `instant`. */
export function toIndiaDate(instant: Date): string {
  return new Date(instant.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Adds whole days to a `YYYY-MM-DD` string. */
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}
