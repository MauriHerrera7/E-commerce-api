import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { Categories } from 'src/modules/categories/entities/category.entity';
import { UpdateProductsDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly categoriesRepository;
    constructor(productsRepository: Repository<Products>, categoriesRepository: Repository<Categories>);
    seeder(): Promise<{
        message: string;
        total: number;
        inserted: number;
    }>;
    getproducts(page: number, limit: number): Promise<{
        message: string;
        products: Products[];
    }>;
    updateProductInfo(id: string, updateData: Partial<UpdateProductsDto>): Promise<Products | null>;
}
