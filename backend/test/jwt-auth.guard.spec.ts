import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { extractBearerOrCookieToken, JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const jwtService = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  const guard = new JwtAuthGuard(jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = '1234567890123456';
  });

  it('extracts token from bearer header first', () => {
    expect(
      extractBearerOrCookieToken({
        headers: {
          authorization: 'Bearer bearer-token',
          cookie: 'intradebas_admin_token=cookie-token',
        },
      } as any),
    ).toBe('bearer-token');
  });

  it('falls back to cookie token', () => {
    expect(
      extractBearerOrCookieToken({
        headers: {
          cookie: 'intradebas_admin_token=cookie-token',
        },
      } as any),
    ).toBe('cookie-token');
  });

  it('authorizes request with cookie token', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 'user-1' });
    const request = {
      headers: {
        cookie: 'intradebas_admin_token=cookie-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    await expect(guard.canActivate(context as any)).resolves.toBe(true);
    expect(request).toHaveProperty('user.sub', 'user-1');
  });

  it('rejects requests without token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    };

    await expect(guard.canActivate(context as any)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
