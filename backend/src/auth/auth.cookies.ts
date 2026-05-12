import type { Request, Response } from 'express';

export const ADMIN_ACCESS_COOKIE = 'intradebas_admin_token';
export const ADMIN_REFRESH_COOKIE = 'intradebas_admin_refresh_token';

type CookieOptions = {
  httpOnly: boolean;
  sameSite: 'lax';
  secure: boolean;
  path: string;
  maxAge: number;
};

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function buildAdminAccessCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: 1000 * 60 * 60 * 8,
  };
}

export function buildAdminRefreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

export function setAdminSessionCookies(
  response: Response,
  input: { accessToken: string; refreshToken: string },
) {
  response.cookie(ADMIN_ACCESS_COOKIE, input.accessToken, buildAdminAccessCookieOptions());
  response.cookie(
    ADMIN_REFRESH_COOKIE,
    input.refreshToken,
    buildAdminRefreshCookieOptions(),
  );
}

export function clearAdminSessionCookies(response: Response) {
  const accessOptions = buildAdminAccessCookieOptions();
  const refreshOptions = buildAdminRefreshCookieOptions();
  response.clearCookie(ADMIN_ACCESS_COOKIE, { ...accessOptions, maxAge: undefined });
  response.clearCookie(ADMIN_REFRESH_COOKIE, { ...refreshOptions, maxAge: undefined });
}

export function parseCookieHeader(header?: string) {
  if (!header) {
    return {};
  }

  return header
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, entry) => {
      const [key, ...valueParts] = entry.split('=');

      if (!key) {
        return cookies;
      }

      cookies[key] = decodeURIComponent(valueParts.join('='));
      return cookies;
    }, {});
}

export function getAdminAccessTokenFromRequest(request: Request) {
  return parseCookieHeader(request.headers.cookie)[ADMIN_ACCESS_COOKIE];
}

export function getAdminRefreshTokenFromRequest(request: Request) {
  return parseCookieHeader(request.headers.cookie)[ADMIN_REFRESH_COOKIE];
}
