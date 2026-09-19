import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type Bucket = { count: number; resetAt: number };

/** A small in-memory protection for credential endpoints. For multiple replicas,
 * replace this store with Redis so the limit is shared between instances. */
@Injectable()
export class LoginRateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();
    const windowMs = this.configService.get<number>(
      'RATE_LIMIT_WINDOW_MS',
      60_000,
    );
    const maximum = this.configService.get<number>('RATE_LIMIT_MAX', 10);
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : (forwardedFor?.split(',')[0]?.trim() ?? request.ip);
    const key = `${ip}:${request.route?.path ?? request.path}`;
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (bucket.count >= maximum) {
      throw new HttpException(
        'Too many attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    bucket.count += 1;
    return true;
  }
}
