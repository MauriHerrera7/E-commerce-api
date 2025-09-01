import { Categories } from "src/modules/categories/entities/category.entity";
import { OrderDetails } from "src/modules/orders/entities/orderDetails.entity";
export declare class Products {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imgUrl?: string;
    category: Categories;
    orderDetails: OrderDetails[];
}
