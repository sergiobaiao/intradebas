import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { compare } from 'bcryptjs';
import { AuthService } from '../src/auth/auth.service';
import { createPrismaMock } from './helpers';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
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
});

