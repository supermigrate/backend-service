import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/utils';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { env } from './common/config/env';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module';
import ormConfig from 'ormconfig';

const envPath = getEnvPath();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envPath],
    }),
    TypeOrmModule.forRoot(ormConfig),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: env.throttle.ttl,
          limit: env.throttle.limit,
        },
      ],
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
