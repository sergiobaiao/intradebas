import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    if (![UserRole.admin, UserRole.superadmin].includes(user.role)) {
      throw new UnauthorizedException('Usuario sem permissao administrativa');
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.issueRefreshToken(user.id, payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sessao invalida');
    }

    const sessionPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(sessionPayload);
    const refreshToken = await this.rotateRefreshToken(dto.refreshToken, user.id, sessionPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(dto: RefreshTokenDto) {
    const tokenHash = this.hashResetToken(dto.refreshToken);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE "refresh_tokens"
      SET "revoked_at" = NOW()
      WHERE "token_hash" = ${tokenHash}
        AND "revoked_at" IS NULL
    `);

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario nao encontrado');
    }

    return user;
  }

  async listAdminUsers(actorRole: UserRole) {
    this.assertSuperadmin(actorRole);

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: [{ role: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async createAdminUser(dto: CreateAdminUserDto, actorRole: UserRole) {
    this.assertSuperadmin(actorRole);

    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Ja existe um usuario administrativo com este e-mail');
    }

    const passwordHash = await hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email,
        name: dto.name,
        role: dto.role,
        isActive: true,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }

  async updateAdminUser(
    id: string,
    dto: UpdateAdminUserDto,
    actorRole: UserRole,
    actorUserId: string,
  ) {
    this.assertSuperadmin(actorRole);

    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Usuario administrativo nao encontrado');
    }

    if (existing.id === actorUserId && dto.isActive === false) {
      throw new BadRequestException('Voce nao pode desativar a propria conta');
    }

    if (existing.id === actorUserId && dto.role === UserRole.admin) {
      throw new BadRequestException('Voce nao pode remover seu proprio papel de superadmin');
    }

    const data: {
      name?: string;
      role?: UserRole;
      isActive?: boolean;
      passwordHash?: string;
    } = {};

    if (dto.name) {
      data.name = dto.name;
    }

    if (dto.role) {
      data.role = dto.role;
    }

    if (typeof dto.isActive === 'boolean') {
      data.isActive = dto.isActive;
    }

    if (dto.password) {
      data.passwordHash = await hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user || !user.isActive || ![UserRole.admin, UserRole.superadmin].includes(user.role)) {
      return {
        success: true,
      };
    }

    const rawToken = randomBytes(24).toString('hex');
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await this.prisma.$executeRaw(Prisma.sql`
      DELETE FROM "password_reset_tokens"
      WHERE "user_id" = ${user.id}
        AND "used_at" IS NULL
    `);

    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO "password_reset_tokens" (
        "id",
        "user_id",
        "token_hash",
        "expires_at",
        "created_at"
      )
      VALUES (
        gen_random_uuid()::text,
        ${user.id},
        ${tokenHash},
        ${expiresAt},
        NOW()
      )
    `);

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL ?? 'http://localhost:3000';
    const resetUrl = `${frontendBaseUrl}/redefinir-senha?token=${encodeURIComponent(rawToken)}`;

    await this.mailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    return {
      success: true,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token);

    const rows = await this.prisma.$queryRaw<Array<{
      id: string;
      userId: string;
      usedAt: Date | null;
      expiresAt: Date;
      isActive: boolean;
    }>>(Prisma.sql`
      SELECT
        prt."id",
        prt."user_id" AS "userId",
        prt."used_at" AS "usedAt",
        prt."expires_at" AS "expiresAt",
        u."is_active" AS "isActive"
      FROM "password_reset_tokens" prt
      INNER JOIN "users" u ON u."id" = prt."user_id"
      WHERE prt."token_hash" = ${tokenHash}
      LIMIT 1
    `);

    const resetToken = rows[0];

    if (
      !resetToken ||
      resetToken.usedAt ||
      new Date(resetToken.expiresAt).getTime() < Date.now() ||
      !resetToken.isActive
    ) {
      throw new BadRequestException('Token de recuperacao invalido ou expirado');
    }

    const passwordHash = await hash(dto.password, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash,
        },
      }),
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE "password_reset_tokens"
        SET "used_at" = ${new Date()}
        WHERE "id" = ${resetToken.id}
      `),
    ]);

    return {
      success: true,
    };
  }

  private assertSuperadmin(role: UserRole) {
    if (role !== UserRole.superadmin) {
      throw new ForbiddenException('Apenas superadmin pode gerenciar usuarios administrativos');
    }
  }

  private hashResetToken(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private async issueRefreshToken(
    userId: string,
    payload: { sub: string; email: string; role: UserRole; name: string },
  ) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any,
    });
    const tokenHash = this.hashResetToken(refreshToken);
    const expiresAt = this.decodeRefreshTokenExpiry(refreshToken);

    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO "refresh_tokens" (
        "id",
        "user_id",
        "token_hash",
        "expires_at",
        "created_at"
      )
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${tokenHash},
        ${expiresAt},
        NOW()
      )
    `);

    return refreshToken;
  }

  private async rotateRefreshToken(
    previousToken: string,
    userId: string,
    payload: { sub: string; email: string; role: UserRole; name: string },
  ) {
    const previousHash = this.hashResetToken(previousToken);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE "refresh_tokens"
      SET "revoked_at" = NOW()
      WHERE "token_hash" = ${previousHash}
        AND "revoked_at" IS NULL
    `);

    return this.issueRefreshToken(userId, payload);
  }

  private async verifyRefreshToken(refreshToken: string) {
    let decoded: { sub: string };

    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalido ou expirado');
    }

    const tokenHash = this.hashResetToken(refreshToken);
    const rows = await this.prisma.$queryRaw<Array<{
      userId: string;
      expiresAt: Date;
      revokedAt: Date | null;
    }>>(Prisma.sql`
      SELECT
        "user_id" AS "userId",
        "expires_at" AS "expiresAt",
        "revoked_at" AS "revokedAt"
      FROM "refresh_tokens"
      WHERE "token_hash" = ${tokenHash}
      LIMIT 1
    `);

    const stored = rows[0];

    if (!stored || stored.revokedAt || new Date(stored.expiresAt).getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token invalido ou expirado');
    }

    if (stored.userId !== decoded.sub) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    return decoded;
  }

  private decodeRefreshTokenExpiry(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as { exp?: number } | null;

    if (!decoded?.exp) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    return new Date(decoded.exp * 1000);
  }
}
