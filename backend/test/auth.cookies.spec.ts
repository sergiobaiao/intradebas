import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE, parseCookieHeader } from '../src/auth/auth.cookies';

describe('auth cookies', () => {
  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it('parses cookies from header', () => {
    expect(
      parseCookieHeader(
        `${ADMIN_ACCESS_COOKIE}=token-1; ${ADMIN_REFRESH_COOKIE}=refresh-1; theme=dark`,
      ),
    ).toEqual({
      [ADMIN_ACCESS_COOKIE]: 'token-1',
      [ADMIN_REFRESH_COOKIE]: 'refresh-1',
      theme: 'dark',
    });
  });

  it('does not require secure cookies outside production', async () => {
    const { buildAdminAccessCookieOptions, buildAdminRefreshCookieOptions } = await import(
      '../src/auth/auth.cookies'
    );

    expect(buildAdminAccessCookieOptions().secure).toBe(false);
    expect(buildAdminRefreshCookieOptions().secure).toBe(false);
  });

  it('requires secure cookies in production', async () => {
    process.env.NODE_ENV = 'production';
    const { buildAdminAccessCookieOptions, buildAdminRefreshCookieOptions } = await import(
      '../src/auth/auth.cookies'
    );

    expect(buildAdminAccessCookieOptions().secure).toBe(true);
    expect(buildAdminRefreshCookieOptions().secure).toBe(true);
  });
});
