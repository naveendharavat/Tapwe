import { randomInt } from 'node:crypto';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
export const CARD_CODE_LENGTH = 6;

export function generateCardCode(
  random: () => number = () => randomInt(ALPHABET.length) / ALPHABET.length,
): string {
  let code = '';
  for (let i = 0; i < CARD_CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return code;
}
