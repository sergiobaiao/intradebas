import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async listLogs(entityType?: string) {
    const includeGeneric = !entityType || entityType !== 'result';
    const includeResults = !entityType || entityType === 'result';

    const [genericLogs, resultLogs] = await Promise.all([
      includeGeneric
        ? this.prisma.auditLog.findMany({
            where: entityType ? { entityType } : undefined,
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
          })
        : Promise.resolve([]),
      includeResults
        ? this.prisma.resultAuditLog.findMany({
            include: {
              changer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              result: {
                select: {
                  id: true,
                  sport: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  team: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              changedAt: 'desc',
            },
            take: 50,
          })
        : Promise.resolve([]),
    ]);

    return [
      ...genericLogs,
      ...resultLogs.map((log: Prisma.ResultAuditLogGetPayload<{
        include: {
          changer: {
            select: {
              id: true;
              name: true;
              email: true;
            };
          };
          result: {
            select: {
              id: true;
              sport: {
                select: {
                  id: true;
                  name: true;
                };
              };
              team: {
                select: {
                  id: true;
                  name: true;
                };
              };
            };
          };
        };
      }>) => ({
        id: log.id,
        entityType: 'result',
        entityId: log.resultId,
        entityLabel: `${log.result.sport.name}${log.result.team ? ` · ${log.result.team.name}` : ''}`,
        action: 'update',
        fieldChanged: log.fieldChanged,
        oldValue: log.oldValue,
        newValue: log.newValue,
        changedBy: log.changedBy,
        changedAt: log.changedAt,
        changer: log.changer,
      })),
    ].sort(
      (left, right) =>
        new Date(right.changedAt).getTime() - new Date(left.changedAt).getTime(),
    ).slice(0, 50);
  }
}
