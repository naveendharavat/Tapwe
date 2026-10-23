/** The seed creates demo accounts with published passwords, so it must never touch production. */
export function assertSeedAllowed(nodeEnv: string | undefined): void {
  if (nodeEnv === 'production') {
    throw new Error('Refusing to seed in production: the seed creates accounts with known passwords.');
  }
}
