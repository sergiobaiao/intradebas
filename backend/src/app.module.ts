import { Module } from '@nestjs/common';
import { AthletesModule } from './athletes/athletes.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [PrismaModule, HealthModule, TeamsModule, AthletesModule],
})
export class AppModule {}
