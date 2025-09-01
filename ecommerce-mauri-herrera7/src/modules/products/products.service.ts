import { Injectable, NotFoundException } from '@nestjs/common';
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
      const category = categories.find((cat) => cat.name === element.category);

      if (!category) {
        console.warn(`Categoría no encontrada para el producto: ${element.name}`);
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

    let products: Products[] = await this.productsRepository.find({
  relations: ['category'],
});

    const start = (page - 1) * limit;
    const end = start + limit;
     products = products.slice(start, end);

    if (!products || products.length === 0) {
      throw new NotFoundException('NO HAY PRODUCTOS');}

    return{
      message: 'ESTOS SON LOS PRODUCTOS',
      products,
    }
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