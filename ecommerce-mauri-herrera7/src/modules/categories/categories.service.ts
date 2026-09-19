import { BadRequestException, Injectable } from '@nestjs/common';
import * as data from '../../data.json';
import { Categories } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    const result = await this.categoriesRepository.upsert(categoriesToInsert, [
      'name',
    ]);

    return {
      message: 'CATEGORÍAS AGREGADAS CORRECTAMENTE',
      total: categoriesToInsert.length,
      inserted: result.generatedMaps.length,
    };
  }

  async getcategories(page: number, limit: number) {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'page must be positive and limit must be between 1 and 100',
      );
    }
    const [categories, total] = await this.categoriesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
    return {
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
