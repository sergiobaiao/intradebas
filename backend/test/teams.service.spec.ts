import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamsService } from '../src/teams/teams.service';
import { createPrismaMock } from './helpers';

describe('TeamsService', () => {
  const prisma = createPrismaMock();
  const service = new TeamsService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns team with athlete count', async () => {
    prisma.team.findUnique.mockResolvedValue({
      id: 'team-1',
      name: 'Mucura',
      color: '#E63946',
      totalScore: 10,
      _count: { athletes: 4 },
    });

    const result = await service.findOne('team-1');

    expect(result.athletesCount).toBe(4);
    expect(result.name).toBe('Mucura');
  });

  it('throws for unknown team', async () => {
    prisma.team.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns athletes for a team', async () => {
    prisma.team.findUnique.mockResolvedValue({
      id: 'team-1',
      name: 'Mucura',
      color: '#E63946',
      totalScore: 10,
      _count: { athletes: 1 },
    });
    prisma.athlete.findMany.mockResolvedValue([
      {
        id: 'athlete-1',
        name: 'Joao Silva',
        cpf: '123.456.789-00',
        email: null,
        phone: null,
        birthDate: new Date('1990-01-01'),
        type: 'titular',
        status: 'active',
        unit: null,
        shirtSize: 'M',
        createdAt: new Date('2026-04-17T00:00:00Z'),
        team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 10 },
        registrations: [{ sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' } }],
      },
    ]);

    const result = await service.findAthletes('team-1');

    expect(result).toHaveLength(1);
    expect(result[0].sports[0].name).toBe('Futsal');
  });

  it('creates a team', async () => {
    prisma.team.create.mockResolvedValue({
      id: 'team-2',
      name: 'Arara Azul',
      color: '#123456',
      totalScore: 0,
    });

    const result = await service.create({
      name: 'Arara Azul',
      color: '#123456',
    });

    expect(prisma.team.create).toHaveBeenCalledWith({
      data: {
        name: 'Arara Azul',
        color: '#123456',
      },
    });
    expect(result.name).toBe('Arara Azul');
  });

  it('updates a team when it exists', async () => {
    prisma.team.findUnique.mockResolvedValue({
      id: 'team-1',
      name: 'Mucura',
      color: '#E63946',
    });
    prisma.auditLog.createMany.mockResolvedValue({ count: 2 });
    prisma.team.update.mockResolvedValue({
      id: 'team-1',
      name: 'Mucura Prime',
      color: '#111111',
      totalScore: 10,
    });

    const result = await service.update('team-1', {
      name: 'Mucura Prime',
      color: '#111111',
    }, 'admin-1');

    expect(prisma.auditLog.createMany).toHaveBeenCalled();
    expect(result.name).toBe('Mucura Prime');
  });

  it('deletes an empty team', async () => {
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1', name: 'Mucura' });
    prisma.athlete.count.mockResolvedValue(0);
    prisma.result.count.mockResolvedValue(0);
    prisma.auditLog.createMany.mockResolvedValue({ count: 1 });
    prisma.team.delete.mockResolvedValue({ id: 'team-1' });

    const result = await service.remove('team-1', 'admin-1');

    expect(prisma.team.delete).toHaveBeenCalledWith({ where: { id: 'team-1' } });
    expect(prisma.auditLog.createMany).toHaveBeenCalled();
    expect(result).toEqual({ id: 'team-1', deleted: true });
  });

  it('rejects team deletion when athletes still exist', async () => {
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.athlete.count.mockResolvedValue(2);
    prisma.result.count.mockResolvedValue(0);

    await expect(service.remove('team-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
