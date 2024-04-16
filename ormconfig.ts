import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './src/common/config/env';

const getEnvConfig = (): TypeOrmModuleOptions => {
  type DBType = 'mongodb';

  return {
    type: env.db.connection as DBType,
    url: env.db.url,
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    entities: ['dist/src/modules/**/entities/*.entity*{.ts,.js}'],
    migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  };
};

const ormConfig: TypeOrmModuleOptions = getEnvConfig();

export default ormConfig;
