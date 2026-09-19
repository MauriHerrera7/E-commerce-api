import { UnprocessableEntityException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { OrdersService } from './orders.service';
import { Products } from '../products/entities/products.entity';

describe('OrdersService', () => {
  const user = { id: 'user-1' };
  const product = {
    id: 'product-1',
    name: 'Keyboard',
    price: 25,
    stock: 3,
  } as Products;

  function makeService(stock = 3) {
    const manager = {
      findOneBy: jest.fn().mockResolvedValue(user),
      findOne: jest.fn((entity, options) => {
        if (entity === Products) {
          return Promise.resolve({ ...product, stock });
        }
        if (options.where.id) {
          return Promise.resolve({ id: 'order-1', items: [], user });
        }
        return Promise.resolve(null);
      }),
      create: jest.fn((_entity, data) => data),
      save: jest
        .fn()
        .mockResolvedValueOnce({ id: 'order-1' })
        .mockResolvedValueOnce([]),
      decrement: jest.fn().mockResolvedValue(undefined),
    };
    const dataSource = {
      transaction: jest.fn((callback) => callback(manager)),
    };
    const service = new OrdersService(
      {} as never,
      { findOne: jest.fn().mockResolvedValue(null) } as never,
      {} as never,
      {} as never,
      dataSource as never,
    );
    return { service, manager, dataSource };
  }

  it('combines repeated product lines, snapshots prices, and decrements stock once', async () => {
    const { service, manager } = makeService();

    await service.create(
      'user-1',
      {
        items: [
          { productId: 'product-1', quantity: 1 },
          { productId: 'product-1', quantity: 2 },
        ],
      },
      'request-1',
    );

    expect(manager.save).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({ user, total: 75 }),
    );
    expect(manager.decrement).toHaveBeenCalledWith(
      Products,
      { id: 'product-1' },
      'stock',
      3,
    );
  });

  it('rolls back before persisting when stock is insufficient', async () => {
    const { service, manager } = makeService(1);

    await expect(
      service.create(
        'user-1',
        { items: [{ productId: 'product-1', quantity: 2 }] },
        'request-1',
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
    expect(manager.save).not.toHaveBeenCalled();
    expect(manager.decrement).not.toHaveBeenCalled();
  });

  it('returns an existing order without touching inventory for a repeated key', async () => {
    const existingOrder = { id: 'order-previous', items: [], user };
    const ordersRepository = {
      findOne: jest.fn().mockResolvedValue(existingOrder),
    };
    const { dataSource } = makeService();
    const service = new OrdersService(
      {} as never,
      ordersRepository as never,
      {} as never,
      {} as never,
      dataSource as never,
    );

    await expect(
      service.create(
        'user-1',
        { items: [{ productId: 'product-1', quantity: 1 }] },
        'request-1',
      ),
    ).resolves.toEqual({
      message: 'ORDEN RECUPERADA CORRECTAMENTE',
      order: existingOrder,
    });
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });
});
