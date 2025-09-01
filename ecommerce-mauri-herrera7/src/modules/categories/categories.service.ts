import { Injectable, NotFoundException } from '@nestjs/common';
import * as data from '../../data.json';
import { Categories } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductsDto } from '../products/dto/update-product.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async seeder() {
  const categoryNames = [...new Set(data.map((e) => e.category))];

  if (categoryNames.length === 0) {
    return { message: 'No hay categorías para insertar.' };
  }

  const categoriesToInsert = categoryNames.map((name) => ({ name }));

  const result = await this.categoriesRepository.upsert(categoriesToInsert, ['name']);

  return {
    message: 'CATEGORÍAS AGREGADAS CORRECTAMENTE',
    total: categoriesToInsert.length,
    inserted: result.generatedMaps.length,
  };
}

async getcategories(page: number, limit: number) {

   let categories = await this.categoriesRepository.find();
    const start = (page - 1) * limit;
    const end = start + limit;
    categories = categories.slice(start, end);

  

    return{
      message: 'ESTOS SON LAS CATEGORIAS',
      categories,
    }
    }  

}
