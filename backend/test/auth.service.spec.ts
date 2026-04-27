import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { AuthService } from '../src/auth/auth.service';
import { createPrismaMock } from './helpers';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const prisma = createPrismaMock();
  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;

  const service = new AuthService(prisma as any, jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns token and user for valid admin credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@intradebas.local',
      name: 'Administrador',
      role: UserRole.superadmin,
      isActive: true,
      passwordHash: 'hashed',
    });
    (compare as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token-123');
    prisma.user.update.mockResolvedValue({});

    const result = await service.login({
      email: 'ADMIN@INTRADEBAS.LOCAL',
      password: 'admin123',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@intradebas.local' },
    });
    expect(result.accessToken).toBe('token-123');
    expect(result.user.email).toBe('admin@intradebas.local');
  });

  it('rejects invalid password', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@intradebas.local',
      name: 'Administrador',
      role: UserRole.admin,
      isActive: true,
      passwordHash: 'hashed',
    });
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'admin@intradebas.local',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects inactive user in me()', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.me('missing')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('lists admin users for superadmin', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'user-2', email: 'op@intradebas.local' }]);

    const result = await service.listAdminUsers(UserRole.superadmin);

    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('rejects admin-user listing for non-superadmin', async () => {
    await expect(service.listAdminUsers(UserRole.admin)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('creates a new admin user with hashed password', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue('hashed-password');
    prisma.user.create.mockResolvedValue({
      id: 'user-2',
      email: 'op@intradebas.local',
      name: 'Operador',
      role: UserRole.admin,
      isActive: true,
    });

    const result = await service.createAdminUser(
      {
        email: 'OP@INTRADEBAS.LOCAL',
        name: 'Operador',
        role: UserRole.admin,
        password: 'admin456',
      },
      UserRole.superadmin,
    );

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'op@intradebas.local',
          passwordHash: 'hashed-password',
        }),
      }),
    );
    expect(result.email).toBe('op@intradebas.local');
  });

  it('rejects duplicate admin email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      service.createAdminUser(
        {
          email: 'admin@intradebas.local',
          name: 'Administrador',
          role: UserRole.admin,
          password: 'admin456',
        },
        UserRole.superadmin,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates an admin user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-2',
      role: UserRole.admin,
      isActive: true,
    });
    prisma.user.update.mockResolvedValue({
      id: 'user-2',
      email: 'op@intradebas.local',
      name: 'Operador 2',
      role: UserRole.admin,
      isActive: false,
    });

    const result = await service.updateAdminUser(
      'user-2',
      {
        name: 'Operador 2',
        isActive: false,
      },
      UserRole.superadmin,
      'user-1',
    );

    expect(result.name).toBe('Operador 2');
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('rejects self-demotion of superadmin', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      role: UserRole.superadmin,
      isActive: true,
    });

    await expect(
      service.updateAdminUser(
        'user-1',
        {
          role: UserRole.admin,
        },
        UserRole.superadmin,
        'user-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when updating a missing admin user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.updateAdminUser(
        'missing',
        {
          isActive: false,
        },
        UserRole.superadmin,
        'user-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
