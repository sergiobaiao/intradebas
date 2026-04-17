import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { athleteSeed, sportSeed, teamSeed } from '../shared/fixtures';
import type { AthleteRecord } from '../shared/types';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteStatusDto } from './dto/update-athlete-status.dto';

@Injectable()
export class AthletesService {
  private readonly athletes = new Map<string, AthleteRecord>(
    athleteSeed.map((athlete) => [
      athlete.id,
      {
        ...athlete,
        sports: [...athlete.sports],
        createdAt: new Date().toISOString(),
      },
    ]),
  );

  findAll() {
    return Array.from(this.athletes.values()).map((athlete) =>
      this.toResponse(athlete),
    );
  }

  findOne(id: string) {
    const athlete = this.athletes.get(id);

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    return this.toResponse(athlete);
  }

  create(dto: CreateAthleteDto) {
    if (!dto.lgpdConsent) {
      throw new BadRequestException('Aceite LGPD e obrigatorio');
    }

    if (
      Array.from(this.athletes.values()).some(
        (athlete) => athlete.cpf === dto.cpf,
      )
    ) {
      throw new ConflictException('CPF ja cadastrado no sistema');
    }

    if (!teamSeed.some((team) => team.id === dto.teamId)) {
      throw new BadRequestException('Equipe informada e invalida');
    }

    if (dto.type !== 'titular' && !dto.titularId) {
      throw new BadRequestException(
        'Familiares e convidados devem informar um titular',
      );
    }

    if (
      dto.sports.some(
        (sportId) => !sportSeed.some((sport) => sport.id === sportId),
      )
    ) {
      throw new BadRequestException('Existe modalidade invalida na inscricao');
    }

    const id = `athlete-${this.athletes.size + 1}`;
    const record: AthleteRecord = {
      id,
      name: dto.name,
      cpf: dto.cpf,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      unit: dto.unit,
      type: dto.type,
      titularId: dto.titularId,
      teamId: dto.teamId,
      shirtSize: dto.shirtSize,
      status: dto.type === 'convidado' ? 'pending' : 'active',
      lgpdConsent: dto.lgpdConsent,
      sports: dto.sports,
      createdAt: new Date().toISOString(),
    };

    this.athletes.set(id, record);

    return this.toResponse(record);
  }

  updateStatus(id: string, dto: UpdateAthleteStatusDto) {
    const athlete = this.athletes.get(id);

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    const updated = { ...athlete, status: dto.status };
    this.athletes.set(id, updated);

    return this.toResponse(updated);
  }

  private toResponse(athlete: AthleteRecord) {
    const team = teamSeed.find((item) => item.id === athlete.teamId);
    const sports = athlete.sports
      .map((sportId) => sportSeed.find((item) => item.id === sportId))
      .filter((item): item is (typeof sportSeed)[number] => Boolean(item));

    return {
      id: athlete.id,
      name: athlete.name,
      cpf: athlete.cpf,
      email: athlete.email,
      phone: athlete.phone,
      birthDate: athlete.birthDate,
      type: athlete.type,
      status: athlete.status,
      unit: athlete.unit,
      shirtSize: athlete.shirtSize,
      createdAt: athlete.createdAt,
      team,
      sports,
    };
  }
}
