import { config as loadDotenv } from 'dotenv';

type Environment = Record<string, string | undefined>;

const isProduction = (environment: Environment) =>
  environment.NODE_ENV === 'production';

const required = (environment: Environment, key: string): string => {
  const value = environment[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const integer = (environment: Environment, key: string, fallback: number) => {
  const value = environment[key];
  if (value === undefined || value === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${key} must be a positive integer`);
  }
  return parsed;
};

/** Loads a local file for development CLI commands. Production receives secrets
 * from its runtime environment or secret manager and never reads a repository file. */
export function loadEnvironmentForCli(): void {
  if (process.env.NODE_ENV !== 'production') {
    loadDotenv({ path: process.env.ENV_FILE ?? '.env' });
  }
}

export function validateEnvironment(
  input: Record<string, unknown>,
): Environment {
  const environment = input as Environment;
  const nodeEnv = environment.NODE_ENV ?? 'development';

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  for (const key of [
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'CLOUD_NAME',
    'API_KEY',
    'API_SECRET',
  ]) {
    required(environment, key);
  }

  if (required(environment, 'JWT_SECRET').length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  if (isProduction({ ...environment, NODE_ENV: nodeEnv })) {
    required(environment, 'CORS_ORIGINS');
  }

  integer(environment, 'PORT', 3000);
  integer(environment, 'DB_PORT', 5432);
  integer(environment, 'RATE_LIMIT_WINDOW_MS', 60_000);
  integer(environment, 'RATE_LIMIT_MAX', 10);

  return { ...environment, NODE_ENV: nodeEnv };
}
