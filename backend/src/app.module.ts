import { Module } from '@nestjs/common';
import { AthletesModule } from './athletes/athletes.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultsModule } from './results/results.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    ResultsModule,
    TeamsModule,
    AthletesModule,
    SponsorshipModule,
  ],
})
export class AppModule {}
