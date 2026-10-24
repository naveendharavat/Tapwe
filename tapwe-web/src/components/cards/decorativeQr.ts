export const QR_GRID = 25

/** Seeded pseudo-random modules for a QR-looking pattern (marketing mockups only — not scannable). */
export function decorativeQrCells(seed: string): Array<[x: number, y: number]> {
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const rnd = () => {
    h ^= h << 13
    h >>>= 0
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return h / 4294967296
  }
  const N = QR_GRID
  const isFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
  const cells: Array<[number, number]> = []
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!isFinder(x, y) && rnd() > 0.52) cells.push([x, y])
    }
  }
  return cells
}
