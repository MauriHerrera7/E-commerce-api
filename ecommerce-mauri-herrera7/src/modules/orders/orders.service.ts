import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Orders } from './entities/order.entity';
import { OrderItem } from './entities/orderDetails.entity';
import { Products } from 'src/modules/products/entities/products.entity';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
    idempotencyKey?: string,
  ) {
    const normalizedIdempotencyKey = idempotencyKey?.trim();
    if (!normalizedIdempotencyKey || normalizedIdempotencyKey.length > 128) {
      throw new BadRequestException(
        'EL HEADER IDEMPOTENCY-KEY ES OBLIGATORIO Y DEBE TENER HASTA 128 CARACTERES',
      );
    }

    const existingOrder = await this.findByIdempotencyKey(
      userId,
      normalizedIdempotencyKey,
    );
    if (existingOrder) {
      return {
        message: 'ORDEN RECUPERADA CORRECTAMENTE',
        order: existingOrder,
      };
    }

    const quantities = new Map<string, number>();
    for (const item of createOrderDto.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const concurrentOrder = await manager.findOne(Orders, {
          where: {
            user: { id: userId },
            idempotencyKey: normalizedIdempotencyKey,
          },
          relations: { items: { product: true }, user: true },
        });
        if (concurrentOrder) {
          return {
            message: 'ORDEN RECUPERADA CORRECTAMENTE',
            order: concurrentOrder,
          };
        }

        const user = await manager.findOneBy(Users, { id: userId });
        if (!user) throw new NotFoundException('USUARIO NO ENCONTRADO');

        const lines: Array<{ product: Products; quantity: number }> = [];
        let total = 0;
        for (const [productId, quantity] of quantities) {
          const product = await manager.findOne(Products, {
            where: { id: productId },
            lock: { mode: 'pessimistic_write' },
          });
          if (!product) throw new NotFoundException('PRODUCTO NO ENCONTRADO');
          if (product.stock < quantity) {
            throw new UnprocessableEntityException(
              `STOCK INSUFICIENTE PARA ${product.name}`,
            );
          }
          total += Number(product.price) * quantity;
          lines.push({ product, quantity });
        }

        const order = await manager.save(
          Orders,
          manager.create(Orders, {
            user,
            total: Number(total.toFixed(2)),
            idempotencyKey: normalizedIdempotencyKey,
          }),
        );
        const orderItems = lines.map(({ product, quantity }) =>
          manager.create(OrderItem, {
            order,
            product,
            quantity,
            unitPrice: Number(product.price),
            productName: product.name,
          }),
        );
        await manager.save(OrderItem, orderItems);

        for (const { product, quantity } of lines) {
          await manager.decrement(
            Products,
            { id: product.id },
            'stock',
            quantity,
          );
        }

        const createdOrder = await manager.findOne(Orders, {
          where: { id: order.id },
          relations: { items: { product: true }, user: true },
        });
        return { message: 'ORDEN CREADA CORRECTAMENTE', order: createdOrder };
      });
    } catch (error: unknown) {
      if (!this.isUniqueIdempotencyConflict(error)) throw error;

      const concurrentOrder = await this.findByIdempotencyKey(
        userId,
        normalizedIdempotencyKey,
      );
      if (concurrentOrder) {
        return {
          message: 'ORDEN RECUPERADA CORRECTAMENTE',
          order: concurrentOrder,
        };
      }
      throw error;
    }
  }

  private async findByIdempotencyKey(userId: string, idempotencyKey: string) {
    return this.ordersRepository.findOne({
      where: { user: { id: userId }, idempotencyKey },
      relations: { items: { product: true }, user: true },
    });
  }

  private isUniqueIdempotencyConflict(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    );
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const order: Orders | null = await this.ordersRepository.findOne({
      where: currentUser.isAdmin
        ? { id }
        : { id, user: { id: currentUser.id } },
      relations: {
        items: { product: true },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('ORDEN NO ENCONTRADA');
    }

    return {
      message: 'ORDEN ENCONTRADA',
      data: order,
    };
  }
}
