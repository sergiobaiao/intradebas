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
        coupon: {
          findUnique: jest.fn(),
          updateMany: jest.fn(),
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

  it('redeems an active coupon during guest registration', async () => {
    prisma.athlete.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'titular-1', type: AthleteType.titular });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.sport.findMany.mockResolvedValue([{ id: 'sport-1' }]);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        athlete: {
          create: jest.fn().mockResolvedValue({ id: 'athlete-2' }),
          findUniqueOrThrow: jest.fn().mockResolvedValue({
            id: 'athlete-2',
            name: 'Convidado Cupom',
            cpf: '123.456.789-00',
            email: null,
            phone: null,
            birthDate: new Date('1990-01-01'),
            type: AthleteType.convidado,
            status: AthleteStatus.active,
            unit: null,
            shirtSize: ShirtSize.M,
            createdAt: new Date('2026-04-18T00:00:00Z'),
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
        coupon: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'coupon-1',
            status: 'active',
          }),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      }),
    );

    const result = await service.create({
      ...validDto,
      name: 'Convidado Cupom',
      type: 'convidado',
      titularId: 'titular-1',
      couponCode: ' cortesia-2026 ',
    });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.status).toBe('active');
  });

  it('rejects registration with an invalid or used coupon', async () => {
    prisma.athlete.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'titular-1', type: AthleteType.titular });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.sport.findMany.mockResolvedValue([{ id: 'sport-1' }]);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        athlete: {
          create: jest.fn(),
          findUniqueOrThrow: jest.fn(),
        },
        registration: {
          createMany: jest.fn(),
        },
        coupon: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'coupon-1',
            status: 'used',
          }),
          updateMany: jest.fn(),
        },
      }),
    );

    await expect(
      service.create({
        ...validDto,
        type: 'convidado',
        titularId: 'titular-1',
        couponCode: 'JA-USADO',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
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

  it('updates athlete profile data and replaces sport registrations', async () => {
    prisma.athlete.findUnique.mockResolvedValue({ id: 'athlete-1', teamId: 'team-1' });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-2' });
    prisma.sport.findMany.mockResolvedValue([{ id: 'sport-2' }]);
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        athlete: {
          update: jest.fn().mockResolvedValue({}),
          findUniqueOrThrow: jest.fn().mockResolvedValue({
            id: 'athlete-1',
            name: 'Joao Atualizado',
            cpf: '123.456.789-00',
            email: 'novo@email.com',
            phone: '86988887777',
            birthDate: new Date('1991-02-02'),
            type: AthleteType.titular,
            status: AthleteStatus.active,
            unit: 'Bloco B',
            shirtSize: ShirtSize.G,
            createdAt: new Date('2026-04-17T00:00:00Z'),
            team: { id: 'team-2', name: 'Jacare', color: '#2D6A4F', totalScore: 0 },
            registrations: [
              {
                sport: { id: 'sport-2', name: 'Volei', category: 'coletiva' },
              },
            ],
          }),
        },
        registration: {
          deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      }),
    );

    const result = await service.update('athlete-1', {
      name: 'Joao Atualizado',
      email: 'novo@email.com',
      phone: '86988887777',
      birthDate: '1991-02-02',
      unit: 'Bloco B',
      teamId: 'team-2',
      shirtSize: 'G',
      sports: ['sport-2'],
    });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.name).toBe('Joao Atualizado');
    expect(result.team?.id).toBe('team-2');
    expect(result.sports[0].id).toBe('sport-2');
  });

  it('returns paginated athlete review data with filters', async () => {
    prisma.athlete.count.mockResolvedValue(2);
    prisma.athlete.findMany.mockResolvedValue([
      {
        id: 'athlete-1',
        name: 'Joao Silva',
        cpf: '123.456.789-00',
        email: null,
        phone: null,
        birthDate: new Date('1990-01-01'),
        type: 'titular',
        status: 'pending',
        unit: null,
        shirtSize: 'M',
        createdAt: new Date('2026-04-17T00:00:00Z'),
        team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 10 },
        registrations: [{ sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' } }],
      },
    ]);

    const result = await service.findReviewPage({
      page: '2',
      pageSize: '5',
      status: 'pending',
      teamId: 'team-1',
      search: 'joao',
    });

    expect(prisma.athlete.count).toHaveBeenCalled();
    expect(prisma.athlete.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      }),
    );
    expect(result.total).toBe(2);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(1);
  });
});
