import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Orders } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { Products } from 'src/modules/products/entities/products.entity';

@Injectable()
export class OrdersService {
   constructor( 
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private OrderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ){}


  async create(createOrderDto: CreateOrderDto) {
     
    const user: Users | null = await this.usersRepository.findOneBy({
      id: createOrderDto.userId,
    });

    if(!user){
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }

    const order = new Orders();
    order.user = user;
    order.date = new Date();
   
    const newOrder = await this.ordersRepository.save(order);

    let total= 0;

    const productsArray: Products[] = await Promise.all(
      createOrderDto.products.map(async (element)=>{
        const product : Products | null =
        await this.productsRepository.findOneBy({
          id: element?.id,
        });

        if(!product){
          throw new Error('PRODUCTO NO ENCONTRADO');
        }

        total += Number(product.price);
  
        await this.productsRepository.update(
          { id: product.id },
          { stock: product.stock - 1},
        );

        if (product.stock < 0) {
          throw new NotFoundException ('STOCK INSUFICIENTE');
        }

        return product;
      }),
    );

    const orderDetail = new OrderDetails();
    orderDetail.order = newOrder;
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.products = productsArray;
  
    await this.OrderDetailsRepository.save(orderDetail); 

    const createdOrder = await this.ordersRepository.findOne({
    where: { id: newOrder.id },
    relations: {
      orderDetails: {
        products: true,
      },
    },
  });

  return {
    message: 'ORDEN CREADA CORRECTAMENTE',
    order: createdOrder,
  };
  }
  

async findOne(id: string) {
  const order: Orders | null = await this.ordersRepository.findOne({
    where: { id },
    relations: {
      orderDetails: {
        products: true,
      },
    },
  });

  if (!order) {
    throw new Error('ORDEN NO ENCONTRADA');
  }

    return {
    message: 'ORDEN ENCONTRADA',
    data: order,
  };
}

}