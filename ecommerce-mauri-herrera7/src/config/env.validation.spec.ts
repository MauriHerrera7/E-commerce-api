import { validateEnvironment } from './env.validation';

const validEnvironment = () => ({
  NODE_ENV: 'test',
  DB_HOST: 'localhost',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'secret',
  DB_NAME: 'ecommerce_test',
  JWT_SECRET: 'a-32-character-secret-for-tests-only',
  CLOUD_NAME: 'cloud',
  API_KEY: 'key',
  API_SECRET: 'secret',
});

describe('validateEnvironment', () => {
  it('rejects an insecure JWT secret', () => {
    expect(() =>
      validateEnvironment({ ...validEnvironment(), JWT_SECRET: 'short' }),
    ).toThrow('JWT_SECRET must contain at least 32 characters');
  });

  it('requires an explicit CORS allowlist in production', () => {
    expect(() =>
      validateEnvironment({ ...validEnvironment(), NODE_ENV: 'production' }),
    ).toThrow('Missing required environment variable: CORS_ORIGINS');
  });

  it('accepts a complete production configuration', () => {
    expect(
      validateEnvironment({
        ...validEnvironment(),
        NODE_ENV: 'production',
        CORS_ORIGINS: 'https://shop.example',
      }),
    ).toMatchObject({
      NODE_ENV: 'production',
      CORS_ORIGINS: 'https://shop.example',
    });
  });

  it('accepts a PostgreSQL connection URL instead of split database values', () => {
    const renderEnvironment = validEnvironment();
    delete renderEnvironment.DB_HOST;
    delete renderEnvironment.DB_USERNAME;
    delete renderEnvironment.DB_PASSWORD;
    delete renderEnvironment.DB_NAME;

    expect(
      validateEnvironment({
        ...renderEnvironment,
        DATABASE_URL: 'postgresql://user:password@database.internal:5432/shop',
      }),
    ).toMatchObject({
      DATABASE_URL: 'postgresql://user:password@database.internal:5432/shop',
    });
  });
});
