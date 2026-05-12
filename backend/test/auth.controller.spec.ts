import 'reflect-metadata';
import { Response } from 'express';
import { THROTTLER_LIMIT, THROTTLER_TTL } from '@nestjs/throttler/dist/throttler.constants';
import { AuthController } from '../src/auth/auth.controller';

describe('AuthController', () => {
  const authService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    me: jest.fn(),
    listAdminUsers: jest.fn(),
    createAdminUser: jest.fn(),
    updateAdminUser: jest.fn(),
  };

  const controller = new AuthController(authService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets session cookies on login and returns the user payload only', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      user: { id: 'user-1', email: 'admin@intradebas.local' },
    });
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    const result = await controller.login(
      { email: 'admin@intradebas.local', password: 'admin123' } as any,
      response,
    );

    expect((response as any).cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      user: { id: 'user-1', email: 'admin@intradebas.local' },
    });
  });

  it('reads refresh token from cookie when body is empty', async () => {
    authService.refresh.mockResolvedValue({
      accessToken: 'access-2',
      refreshToken: 'refresh-2',
      user: { id: 'user-1' },
    });
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    await controller.refresh(
      {
        headers: {
          cookie: 'intradebas_admin_refresh_token=refresh-cookie-token',
        },
      } as any,
      {} as any,
      response,
    );

    expect(authService.refresh).toHaveBeenCalledWith({
      refreshToken: 'refresh-cookie-token',
    });
  });

  it('clears cookies on logout', async () => {
    authService.logout.mockResolvedValue({ success: true });
    const response = {
      clearCookie: jest.fn(),
    } as unknown as Response;

    const result = await controller.logout(
      {
        headers: {
          cookie: 'intradebas_admin_refresh_token=refresh-cookie-token',
        },
      } as any,
      {} as any,
      response,
    );

    expect(authService.logout).toHaveBeenCalledWith({
      refreshToken: 'refresh-cookie-token',
    });
    expect((response as any).clearCookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ success: true });
  });

  it('applies 5 requests per 60 seconds throttle to login', () => {
    const metadataLimit = Reflect.getMetadata(THROTTLER_LIMIT + 'default', controller.login);
    const metadataTtl = Reflect.getMetadata(THROTTLER_TTL + 'default', controller.login);

    expect(metadataLimit).toBe(5);
    expect(metadataTtl).toBe(60_000);
  });
});
