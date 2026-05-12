import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  clearAdminSessionCookies,
  getAdminRefreshTokenFromRequest,
  setAdminSessionCookies,
} from './auth.cookies';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private resolveRefreshToken(request: Request, dto?: RefreshTokenDto) {
    const refreshToken = dto?.refreshToken ?? getAdminRefreshTokenFromRequest(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente');
    }

    return refreshToken;
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(dto);
    setAdminSessionCookies(response, session);
    return { user: session.user };
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.refresh({
      refreshToken: this.resolveRefreshToken(request, dto),
    });
    setAdminSessionCookies(response, session);
    return { user: session.user };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = dto?.refreshToken ?? getAdminRefreshTokenFromRequest(request);

    if (refreshToken) {
      await this.authService.logout({ refreshToken });
    }

    clearAdminSessionCookies(response);
    return { success: true };
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: { user: { sub: string } }) {
    return this.authService.me(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-users')
  listAdminUsers(@Req() request: { user: { role: 'admin' | 'superadmin' } }) {
    return this.authService.listAdminUsers(request.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin-users')
  createAdminUser(
    @Body() dto: CreateAdminUserDto,
    @Req() request: { user: { role: 'admin' | 'superadmin' } },
  ) {
    return this.authService.createAdminUser(dto, request.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin-users/:id')
  updateAdminUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @Req() request: { user: { sub: string; role: 'admin' | 'superadmin' } },
  ) {
    return this.authService.updateAdminUser(id, dto, request.user.role, request.user.sub);
  }
}
