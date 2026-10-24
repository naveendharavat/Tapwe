import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, { AppConfig } from './config/configuration.js';
import { buildTypeOrmOptions } from './config/typeorm.config.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { PublicModule } from './modules/public/public.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CardRequestsModule } from './modules/card-requests/card-requests.module.js';
import { CardsModule } from './modules/cards/cards.module.js';
import { ChangeRequestsModule } from './modules/change-requests/change-requests.module.js';
import { ProfilesModule } from './modules/profiles/profiles.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) =>
        buildTypeOrmOptions(config.get('db', { infer: true }), config.get('isTest', { infer: true })),
    }),
    HealthModule,
    AuthModule,
    CardRequestsModule,
    CardsModule,
    ChangeRequestsModule,
    ProfilesModule,
    AnalyticsModule,
    PublicModule,
    AdminModule,
  ],
})
export class AppModule {}
