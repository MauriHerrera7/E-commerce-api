import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => this.excludePassword(data)));
  }
  private excludePassword(data: any) {
    if (data === null || data === undefined || typeof data !== 'object')
      return data;
    if (data instanceof Date) return data;
    if (Array.isArray(data))
      return data.map((item) => this.excludePassword(item));

    const rest = Object.fromEntries(
      Object.entries(data as Record<string, unknown>).filter(
        ([key]) => key !== 'password',
      ),
    );
    return Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        this.excludePassword(value),
      ]),
    );
  }
}
