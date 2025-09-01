import { Orders } from "./order.entity";
import { Products } from "src/modules/products/entities/products.entity";
export declare class OrderDetails {
    id: string;
    price: number;
    order: Orders;
    products: Products[];
}
