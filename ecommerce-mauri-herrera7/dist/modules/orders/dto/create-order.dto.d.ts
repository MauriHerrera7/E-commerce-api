import { Products } from "src/modules/products/entities/products.entity";
export declare class CreateOrderDto {
    userId: string;
    products: Partial<Products[]>;
}
