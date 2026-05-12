import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { getAdminAccessTokenFromRequest } from './auth.cookies';

type AuthenticatedRequest = Request & {
  user?: unknown;
};

export function extractBearerOrCookieToken(request: Request) {
  const authorization = request.headers.authorization as string | undefined;

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim();
  }

  return getAdminAccessTokenFromRequest(request);
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearerOrCookieToken(request);

    if (!token) {
      throw new UnauthorizedException('Token de acesso ausente');
    }

    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
