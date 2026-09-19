import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Orders } from './entities/order.entity';
import { OrderItem } from './entities/orderDetails.entity';
import { Products } from 'src/modules/products/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Orders, OrderItem, Products])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
