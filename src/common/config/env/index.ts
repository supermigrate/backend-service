import * as envVar from 'env-var';
import { config } from 'dotenv';
import { getEnvPath } from '../../utils/';

const envPath = getEnvPath();

config({ path: envPath });

export const env = {
  isProduction: envVar.get('APP_ENV').required().asString() === 'production',
  isStaging: envVar.get('APP_ENV').required().asString() === 'staging',
  isDevelopment: envVar.get('APP_ENV').required().asString() === 'development',
  isTest: envVar.get('APP_ENV').required().asString() === 'test',

  app: {
    env: envVar.get('APP_ENV').required().asString(),
    port: envVar.get('APP_PORT').required().asPortNumber(),
    name: envVar.get('APP_NAME').required().asString(),
    url: envVar.get('APP_URL').required().asString(),
    version: envVar.get('APP_VERSION').required().asString(),
  },
  db: {
    connection: envVar.get('DB_CONNECTION').required().asString(),
    url: envVar.get('DB_URL').required().asString(),
    synchronize: envVar.get('DB_SYNCHRONIZE').required().asBool(),
    logging: envVar.get('DB_LOGGING').required().asBool(),
  },
  jwt: {
    secret: envVar.get('JWT_SECRET').required().asString(),
    expiresIn: envVar.get('JWT_EXPIRES_IN').required().asString(),
  },
  throttle: {
    ttl: envVar.get('THROTTLE_TTL').required().asIntPositive(),
    limit: envVar.get('THROTTLE_LIMIT').required().asIntPositive(),
  },
  file: {
    maxSize: envVar.get('MAX_FILE_SIZE').required().asIntPositive(),
    allowedMimes: envVar.get('ALLOWED_MIME_TYPES').required().asArray(),
  },
  github: {
    url: envVar.get('GITHUB_URL').required().asString(),
    clientId: envVar.get('GITHUB_CLIENT_ID').required().asString(),
    clientSecret: envVar.get('GITHUB_CLIENT_SECRET').required().asString(),
    appId: envVar.get('GITHUB_APP_ID').required().asString(),
  },
};
