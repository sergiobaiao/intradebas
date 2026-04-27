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
import { MailService } from '../src/mail/mail.service';
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
  const mailService = {
    sendPasswordResetEmail: jest.fn(),
  } as unknown as MailService;

  const service = new AuthService(prisma as any, jwtService, mailService);

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
    (jwtService.signAsync as jest.Mock)
      .mockResolvedValueOnce('token-123')
      .mockResolvedValueOnce('refresh-token-123');
    (jwtService.decode as any) = jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
    prisma.user.update.mockResolvedValue({});
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.login({
      email: 'ADMIN@INTRADEBAS.LOCAL',
      password: 'admin123',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@intradebas.local' },
    });
    expect(result.accessToken).toBe('token-123');
    expect(result.refreshToken).toBe('refresh-token-123');
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

  it('creates reset token and sends e-mail for valid admin account', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@intradebas.local',
      name: 'Administrador',
      role: UserRole.superadmin,
      isActive: true,
    });
    prisma.$executeRaw.mockResolvedValue(1);
    (mailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

    const result = await service.forgotPassword({
      email: 'ADMIN@INTRADEBAS.LOCAL',
    });

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(2);
    expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('returns generic success for unknown forgot-password email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const result = await service.forgotPassword({
      email: 'missing@intradebas.local',
    });

    expect(result).toEqual({ success: true });
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });

  it('resets password when token is valid', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'reset-1',
        userId: 'user-1',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        isActive: true,
      },
    ]);
    (hash as jest.Mock).mockResolvedValue('hashed-reset-password');
    prisma.user.update.mockResolvedValue({});
    prisma.$executeRaw.mockResolvedValue(1);
    prisma.$transaction.mockResolvedValue([{}, 1]);

    const result = await service.resetPassword({
      token: 'plain-token',
      password: 'nova123',
    });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('rejects expired reset token', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'reset-1',
        userId: 'user-1',
        usedAt: null,
        expiresAt: new Date(Date.now() - 60_000),
        isActive: true,
      },
    ]);

    await expect(
      service.resetPassword({
        token: 'plain-token',
        password: 'nova123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refreshes session with valid refresh token', async () => {
    (jwtService.verifyAsync as any) = jest.fn().mockResolvedValue({ sub: 'user-1' });
    (jwtService.signAsync as jest.Mock)
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');
    (jwtService.decode as any) = jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
    prisma.$queryRaw.mockResolvedValue([
      {
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
      },
    ]);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@intradebas.local',
      name: 'Administrador',
      role: UserRole.superadmin,
      isActive: true,
    });
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.refresh({
      refreshToken: 'refresh-token',
    });

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
  });

  it('rejects invalid refresh token', async () => {
    (jwtService.verifyAsync as any) = jest.fn().mockRejectedValue(new Error('invalid'));

    await expect(
      service.refresh({
        refreshToken: 'invalid',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('revokes refresh token on logout', async () => {
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.logout({
      refreshToken: 'refresh-token',
    });

    expect(prisma.$executeRaw).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
