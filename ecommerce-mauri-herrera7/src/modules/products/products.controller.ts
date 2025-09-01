import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Role } from 'src/roles.enum';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateProductsDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get('/seeder')
  @ApiOperation({ summary: 'Generar productos' })
  seeder(){
    return this.productsService.seeder();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener los productos' })
  getproducts(@Query('page') page: string, @Query('limit') limit: string) {    
    if (page && limit) {
      return this.productsService.getproducts (+page, +limit);
    }
    return this.productsService.getproducts(1,5);
  } 

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar productos' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: UpdateProductsDto,
  ) {
    const updated = await this.productsService.updateProductInfo(id, updateData);
    return {
      message: 'PRODUCTO ACTUALIZADO CORRECTAMENTE',
      product: updated,
    };
  }
}
