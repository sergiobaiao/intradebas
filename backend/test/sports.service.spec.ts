import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SportCategory } from '@prisma/client';
import { SportsService } from '../src/sports/sports.service';
import { createPrismaMock } from './helpers';

describe('SportsService', () => {
  const prisma = createPrismaMock();
  const service = new SportsService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a sport detail with associated results', async () => {
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      name: 'Futsal',
      category: 'coletiva',
      description: null,
      isAldebarun: false,
      isActive: true,
      scheduleDate: null,
      scheduleNotes: null,
      createdAt: new Date('2026-04-20T00:00:00Z'),
      updatedAt: new Date('2026-04-20T00:00:00Z'),
      results: [
        {
          id: 'result-1',
          position: 1,
          calculatedPoints: 5,
          resultDate: new Date('2026-04-20T10:00:00Z'),
          team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
        },
      ],
    });

    const result = await service.findOne('sport-1');

    expect(result.id).toBe('sport-1');
    expect(result.results).toHaveLength(1);
  });

  it('throws when sport detail is missing', async () => {
    prisma.sport.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists active ALDEBARUN sports', async () => {
    prisma.sport.findMany.mockResolvedValue([
      {
        id: 'sport-2',
        name: 'ALDEBARUN 10K',
        category: 'individual',
        description: 'Percurso principal',
        isAldebarun: true,
        isActive: true,
        scheduleDate: new Date('2026-05-02T06:00:00Z'),
        scheduleNotes: 'Largada principal',
      },
    ]);

    const result = await service.findAldebarun();

    expect(prisma.sport.findMany).toHaveBeenCalledWith({
      where: {
        isAldebarun: true,
        isActive: true,
      },
      orderBy: [{ scheduleDate: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        isAldebarun: true,
        isActive: true,
        scheduleDate: true,
        scheduleNotes: true,
      },
    });
    expect(result[0].name).toBe('ALDEBARUN 10K');
  });

  it('creates a sport', async () => {
    prisma.sport.create.mockResolvedValue({
      id: 'sport-2',
      name: 'Corrida de Rua',
      category: SportCategory.individual,
      description: 'Percurso urbano',
      isAldebarun: true,
      isActive: true,
      scheduleDate: new Date('2026-04-22T06:30:00Z'),
      scheduleNotes: 'Largada no estacionamento',
    });

    const result = await service.create({
      name: 'Corrida de Rua',
      category: SportCategory.individual,
      description: 'Percurso urbano',
      isAldebarun: true,
      isActive: true,
      scheduleDate: '2026-04-22T06:30:00Z',
      scheduleNotes: 'Largada no estacionamento',
    });

    expect(prisma.sport.create).toHaveBeenCalledWith({
      data: {
        name: 'Corrida de Rua',
        category: SportCategory.individual,
        description: 'Percurso urbano',
        isAldebarun: true,
        isActive: true,
        scheduleDate: new Date('2026-04-22T06:30:00Z'),
        scheduleNotes: 'Largada no estacionamento',
      },
    });
    expect(result.name).toBe('Corrida de Rua');
  });

  it('updates a sport when it exists', async () => {
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      name: 'Futsal',
      description: null,
      isActive: true,
      scheduleDate: null,
      scheduleNotes: null,
    });
    prisma.auditLog.createMany.mockResolvedValue({ count: 4 });
    prisma.sport.update.mockResolvedValue({
      id: 'sport-1',
      name: 'Futsal Master',
      description: 'Categoria principal',
      isActive: false,
      scheduleDate: new Date('2026-04-21T10:00:00Z'),
      scheduleNotes: 'Quadra principal',
    });

    const result = await service.update('sport-1', {
      name: 'Futsal Master',
      description: 'Categoria principal',
      isActive: false,
      scheduleDate: '2026-04-21T10:00:00Z',
      scheduleNotes: 'Quadra principal',
    }, 'admin-1');

    expect(prisma.auditLog.createMany).toHaveBeenCalled();
    expect(result.name).toBe('Futsal Master');
  });

  it('deletes a sport with no registrations or results', async () => {
    prisma.sport.findUnique.mockResolvedValue({ id: 'sport-1', name: 'Futsal' });
    prisma.registration.count.mockResolvedValue(0);
    prisma.result.count.mockResolvedValue(0);
    prisma.auditLog.createMany.mockResolvedValue({ count: 1 });
    prisma.sport.delete.mockResolvedValue({ id: 'sport-1' });

    const result = await service.remove('sport-1', 'admin-1');

    expect(prisma.sport.delete).toHaveBeenCalledWith({ where: { id: 'sport-1' } });
    expect(prisma.auditLog.createMany).toHaveBeenCalled();
    expect(result).toEqual({ id: 'sport-1', deleted: true });
  });

  it('rejects sport deletion when registrations exist', async () => {
    prisma.sport.findUnique.mockResolvedValue({ id: 'sport-1' });
    prisma.registration.count.mockResolvedValue(2);
    prisma.result.count.mockResolvedValue(0);

    await expect(service.remove('sport-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
