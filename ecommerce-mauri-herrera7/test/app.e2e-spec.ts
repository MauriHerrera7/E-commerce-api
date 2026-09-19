import { ServiceUnavailableException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { HealthController } from '../src/modules/health/health.controller';

describe('Health endpoints', () => {
  it('reports liveness without a database connection', () => {
    const controller = new HealthController({} as never);
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('reports unavailable when the database is down', async () => {
    const controller = new HealthController({
      query: jest.fn().mockRejectedValue(new Error('connection refused')),
    } as never);
    await expect(controller.ready()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
