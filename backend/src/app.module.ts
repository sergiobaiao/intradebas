import { Module } from '@nestjs/common';
import { AuditModule } from './audit/audit.module';
import { AthletesModule } from './athletes/athletes.module';
import { AuthModule } from './auth/auth.module';
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
})
export class AppModule {}
