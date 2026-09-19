import { config as loadDotenv } from 'dotenv';

type Environment = Record<string, string | undefined>;

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

/** Validates only the database-related environment variables.
 * Used by the TypeORM config (migrations, CLI) which does not need
 * app-level secrets such as JWT_SECRET. */
export function validateDbEnvironment(
  input: Record<string, unknown>,
): Environment {
  const environment = input as Environment;

  const databaseUrl = environment.DATABASE_URL?.trim();
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL');
    }
  } else {
    for (const key of ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME']) {
      required(environment, key);
    }
  }

  integer(environment, 'DB_PORT', 5432);

  return environment;
}

export function validateEnvironment(
  input: Record<string, unknown>,
): Environment {
  const environment = input as Environment;
  const nodeEnv = environment.NODE_ENV ?? 'development';

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  validateDbEnvironment(input);

  required(environment, 'JWT_SECRET');

  const cloudinaryKeys = ['CLOUD_NAME', 'API_KEY', 'API_SECRET'];
  const configuredCloudinaryKeys = cloudinaryKeys.filter((key) =>
    Boolean(environment[key]?.trim()),
  );
  if (
    configuredCloudinaryKeys.length > 0 &&
    configuredCloudinaryKeys.length !== cloudinaryKeys.length
  ) {
    throw new Error(
      'CLOUD_NAME, API_KEY and API_SECRET must be configured together',
    );
  }

  if (required(environment, 'JWT_SECRET').length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  integer(environment, 'PORT', 3000);
  integer(environment, 'RATE_LIMIT_WINDOW_MS', 60_000);
  integer(environment, 'RATE_LIMIT_MAX', 10);

  return { ...environment, NODE_ENV: nodeEnv };
}
