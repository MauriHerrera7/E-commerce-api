import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation } from '@nestjs/swagger';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Generar categorias' })
  @Get('seeder')
  seeder() {
    return this.categoriesService.seeder();
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener las categorias' })
  getcategories(@Query('page') page: string, @Query('limit') limit: string) {    
      if (page && limit) {
        return this.categoriesService.getcategories (+page, +limit);
      }
      return this.categoriesService.getcategories(1,5);
    } 

}
