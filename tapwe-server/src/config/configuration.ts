export interface AppConfig {
  port: number;
  webOrigin: string;
  publicCardBaseUrl: string;
  isTest: boolean;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default (): AppConfig => ({
  port: Number(process.env.PORT ?? 4000),
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  publicCardBaseUrl: process.env.PUBLIC_CARD_BASE_URL ?? process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  isTest: process.env.NODE_ENV === 'test',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'tapwe',
    password: process.env.DB_PASSWORD ?? 'tapwe',
    name: process.env.DB_NAME ?? 'tapwe',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
