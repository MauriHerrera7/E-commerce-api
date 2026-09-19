import { of } from 'rxjs';
import { ExcludePasswordInterceptor } from './exclude-password.interceptor';

describe('ExcludePasswordInterceptor', () => {
  it('removes passwords at every nesting level', (done) => {
    const interceptor = new ExcludePasswordInterceptor();
    const next = {
      handle: () =>
        of({
          user: { id: 'user-1', password: 'hashed' },
          orders: [{ user: { id: 'user-2', password: 'also-hashed' } }],
        }),
    };

    interceptor.intercept({} as never, next).subscribe((result) => {
      expect(result).toEqual({
        user: { id: 'user-1' },
        orders: [{ user: { id: 'user-2' } }],
      });
      done();
    });
  });
});
