
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

    return next.handle().pipe(map((data) => this.excludePassword(data)));
  }
  private excludePassword(data: any) {

    if (data.data && Array.isArray(data.data)) {
      return {
        ...data,
        data: data.data.map((item) => this.excludePassword(item)),
      };
    }
    if (typeof data.data === 'object')
      return { ...data, data: this.excludePassword(data.data) };

    if(!data){
      return data;
    }
    if(Array.isArray(data)) {
      return data.map(user => this.excludePassword(user));
    }
    const { password, ...rest } = data;

    return rest;
  }
}
