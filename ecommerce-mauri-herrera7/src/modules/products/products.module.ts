import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Categories } from 'src/modules/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories,Products])],
  controllers: [ProductsController],
  providers: [ProductsService, ],
})
export class ProductsModule {}
