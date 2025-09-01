import { ProductsService } from './products.service';
import { UpdateProductsDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    seeder(): Promise<{
        message: string;
        total: number;
        inserted: number;
    }>;
    getproducts(page: string, limit: string): Promise<{
        message: string;
        products: import("./entities/products.entity").Products[];
    }>;
    updateProduct(id: string, updateData: UpdateProductsDto): Promise<{
        message: string;
        product: import("./entities/products.entity").Products | null;
    }>;
}
