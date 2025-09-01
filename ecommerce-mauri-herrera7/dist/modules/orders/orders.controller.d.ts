import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: import("./entities/order.entity").Orders | null;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./entities/order.entity").Orders;
    }>;
}
