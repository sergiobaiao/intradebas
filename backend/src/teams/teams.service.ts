import { Injectable, NotFoundException } from '@nestjs/common';
import { athleteSeed, teamSeed } from '../shared/fixtures';
import type { TeamSummary } from '../shared/types';

@Injectable()
export class TeamsService {
  private readonly teams: TeamSummary[] = teamSeed.map((team) => ({ ...team }));

  findAll() {
    return this.teams;
  }

  findOne(id: string) {
    const team = this.teams.find((item) => item.id === id);

    if (!team) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    return {
      ...team,
      athletesCount: athleteSeed.filter((athlete) => athlete.teamId === id).length,
    };
  }

  findAthletes(id: string) {
    this.findOne(id);

    return athleteSeed.filter((athlete) => athlete.teamId === id);
  }
}

