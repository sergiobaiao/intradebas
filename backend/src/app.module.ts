import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditModule } from './audit/audit.module';
import { AthletesModule } from './athletes/athletes.module';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { LgpdModule } from './lgpd/lgpd.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ResultsModule } from './results/results.module';
import { SettingsModule } from './settings/settings.module';
import { SportsModule } from './sports/sports.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PrismaModule,
    RealtimeModule,
    AuthModule,
    AuditModule,
    HealthModule,
    LgpdModule,
    MediaModule,
    ResultsModule,
    SettingsModule,
    SportsModule,
    TeamsModule,
    AthletesModule,
    SponsorshipModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
