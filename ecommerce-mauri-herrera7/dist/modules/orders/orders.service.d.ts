import { CreateOrderDto } from './dto/create-order.dto';
import { Repository } from 'typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Orders } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { Products } from 'src/modules/products/entities/products.entity';
export declare class OrdersService {
    private readonly usersRepository;
    private ordersRepository;
    private OrderDetailsRepository;
    private productsRepository;
    constructor(usersRepository: Repository<Users>, ordersRepository: Repository<Orders>, OrderDetailsRepository: Repository<OrderDetails>, productsRepository: Repository<Products>);
    create(createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: Orders | null;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: Orders;
    }>;
}
