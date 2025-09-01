import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
export declare class CategoriesService {
    private readonly categoriesRepository;
    constructor(categoriesRepository: Repository<Categories>);
    seeder(): Promise<{
        message: string;
        total?: undefined;
        inserted?: undefined;
    } | {
        message: string;
        total: number;
        inserted: number;
    }>;
    getcategories(page: number, limit: number): Promise<{
        message: string;
        categories: Categories[];
    }>;
}
