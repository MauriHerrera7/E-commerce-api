import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    seeder(): Promise<{
        message: string;
        total?: undefined;
        inserted?: undefined;
    } | {
        message: string;
        total: number;
        inserted: number;
    }>;
    getcategories(page: string, limit: string): Promise<{
        message: string;
        categories: import("./entities/category.entity").Categories[];
    }>;
}
