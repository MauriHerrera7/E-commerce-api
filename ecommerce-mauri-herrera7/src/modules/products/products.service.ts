import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as data from '../../data.json';
import { Categories } from 'src/modules/categories/entities/category.entity';
import { UpdateProductsDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async seeder() {
    const categories: Categories[] = await this.categoriesRepository.find();

    const newProducts: Products[] = data
      .map((element) => {
        const category = categories.find(
          (cat) => cat.name === element.category,
        );

        if (!category) {
          console.warn(
            `Categoría no encontrada para el producto: ${element.name}`,
          );
          return null;
        }

        const newProduct = new Products();
        newProduct.name = element.name;
        newProduct.description = element.description;
        newProduct.price = element.price;
        newProduct.imgUrl = element.imgUrl;
        newProduct.stock = element.stock;
        newProduct.category = category;

        return newProduct;
      })
      .filter((p): p is Products => p !== null);

    const result = await this.productsRepository.upsert(newProducts, ['name']);

    return {
      message: 'PRODUCTOS AGREGADOS CORRECTAMENTE',
      total: newProducts.length,
      inserted: result.generatedMaps.length,
    };
  }

  async getproducts(page: number, limit: number) {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'page must be positive and limit must be between 1 and 100',
      );
    }
    const [products, total] = await this.productsRepository.findAndCount({
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProductInfo(id: string, updateData: Partial<UpdateProductsDto>) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('PRODUCTO NO ENCONTRADO');
    }

    await this.productsRepository.update(id, updateData);

    return await this.productsRepository.findOneBy({ id });
  }
}
