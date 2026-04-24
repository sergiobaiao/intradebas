import { AuditService } from '../src/audit/audit.service';
import { createPrismaMock } from './helpers';

describe('AuditService', () => {
  const prisma = createPrismaMock();
  const service = new AuditService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists audit logs with optional entityType filter', async () => {
    prisma.auditLog.findMany.mockResolvedValue([
      {
        id: 'audit-1',
        entityType: 'athlete',
        entityId: 'athlete-1',
        entityLabel: 'Joao Silva',
        action: 'update',
        fieldChanged: 'status',
        oldValue: 'pending',
        newValue: 'active',
        changedAt: new Date('2026-04-23T12:00:00Z'),
        changer: {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
      },
    ]);
    prisma.resultAuditLog.findMany.mockResolvedValue([]);

    const result = await service.listLogs('athlete');

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
      where: { entityType: 'athlete' },
      include: {
        changer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: 50,
    });
    expect(result).toHaveLength(1);
  });

  it('merges generic and result audit logs ordered by date', async () => {
    prisma.auditLog.findMany.mockResolvedValue([
      {
        id: 'audit-1',
        entityType: 'team',
        entityId: 'team-1',
        entityLabel: 'Mucura',
        action: 'update',
        fieldChanged: 'color',
        oldValue: '#111111',
        newValue: '#222222',
        changedAt: new Date('2026-04-23T10:00:00Z'),
        changer: {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
      },
    ]);
    prisma.resultAuditLog.findMany.mockResolvedValue([
      {
        id: 'result-audit-1',
        resultId: 'result-1',
        changedBy: 'admin-1',
        fieldChanged: 'position',
        oldValue: '2',
        newValue: '1',
        changedAt: new Date('2026-04-23T12:00:00Z'),
        changer: {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
        result: {
          id: 'result-1',
          sport: {
            id: 'sport-1',
            name: 'Futsal',
          },
          team: {
            id: 'team-1',
            name: 'Mucura',
          },
        },
      },
    ]);

    const result = await service.listLogs();

    expect(result[0]).toMatchObject({
      entityType: 'result',
      entityLabel: 'Futsal · Mucura',
    });
    expect(result[1]).toMatchObject({
      entityType: 'team',
    });
  });
});
