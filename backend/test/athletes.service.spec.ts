import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AthleteStatus, AthleteType, ShirtSize } from '@prisma/client';
import { AthletesService } from '../src/athletes/athletes.service';
import { createPrismaMock } from './helpers';

describe('AthletesService', () => {
  const prisma = createPrismaMock();
  const service = new AthletesService(prisma as any);

  const validDto = {
    name: 'Joao Silva',
    cpf: '123.456.789-00',
    email: 'joao@example.com',
    phone: '86999999999',
    birthDate: '1990-01-01',
    unit: 'Bloco A, Ap. 101',
    type: 'titular' as const,
    teamId: 'team-1',
    shirtSize: 'M' as const,
    sports: ['sport-1'],
    lgpdConsent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects duplicate CPF', async () => {
    prisma.athlete.findUnique.mockResolvedValueOnce({ id: 'existing' });

    await expect(service.create(validDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('creates a guest athlete with pending status inside a transaction', async () => {
    prisma.athlete.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'titular-1', type: AthleteType.titular });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.sport.findMany.mockResolvedValue([{ id: 'sport-1' }]);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        athlete: {
          create: jest.fn().mockResolvedValue({ id: 'athlete-1' }),
          findUniqueOrThrow: jest.fn().mockResolvedValue({
            id: 'athlete-1',
            name: 'Convidado',
            cpf: '123.456.789-00',
            email: null,
            phone: null,
            birthDate: new Date('1990-01-01'),
            type: AthleteType.convidado,
            status: AthleteStatus.pending,
            unit: null,
            shirtSize: ShirtSize.M,
            createdAt: new Date('2026-04-17T00:00:00Z'),
            team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
            registrations: [
              {
                sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
              },
            ],
          }),
        },
        registration: {
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      }),
    );

    const result = await service.create({
      ...validDto,
      name: 'Convidado',
      type: 'convidado',
      titularId: 'titular-1',
    });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.status).toBe('pending');
  });

  it('rejects create without LGPD consent', async () => {
    await expect(
      service.create({
        ...validDto,
        lgpdConsent: false,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects updateStatus for missing athlete', async () => {
    prisma.athlete.findUnique.mockResolvedValue(null);

    await expect(
      service.updateStatus('missing', { status: 'active' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

