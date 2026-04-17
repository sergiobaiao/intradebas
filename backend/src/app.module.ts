import { Module } from '@nestjs/common';
import { AthletesModule } from './athletes/athletes.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [PrismaModule, AuthModule, HealthModule, TeamsModule, AthletesModule],
})
export class AppModule {}
