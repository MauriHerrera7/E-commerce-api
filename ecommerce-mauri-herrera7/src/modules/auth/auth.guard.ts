import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles.enum';
import { Request } from 'express';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('A bearer token is required');
    }
    const token = authorization.slice('Bearer '.length).trim();
    if (!token) throw new UnauthorizedException('A bearer token is required');

    try {
      const payload =
        await this.jwtService.verifyAsync<AuthenticatedUser>(token);
      request.user = {
        ...payload,
        roles: payload.isAdmin ? [Role.Admin] : [Role.User],
      } satisfies AuthenticatedUser;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
