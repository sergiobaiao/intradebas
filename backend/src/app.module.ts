import { Module } from '@nestjs/common';
import { AthletesModule } from './athletes/athletes.module';
import { HealthModule } from './health/health.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [HealthModule, TeamsModule, AthletesModule],
})
export class AppModule {}

