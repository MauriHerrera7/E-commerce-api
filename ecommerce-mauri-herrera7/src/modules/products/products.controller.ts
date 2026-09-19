import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Role } from 'src/roles.enum';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateProductsDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/seeder')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Generar productos' })
  seeder() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new NotFoundException();
    }
    return this.productsService.seeder();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener los productos' })
  getproducts(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productsService.getproducts(page ?? 1, limit ?? 20);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar productos' })
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateProductsDto,
  ) {
    const updated = await this.productsService.updateProductInfo(
      id,
      updateData,
    );
    return {
      message: 'PRODUCTO ACTUALIZADO CORRECTAMENTE',
      product: updated,
    };
  }
}
