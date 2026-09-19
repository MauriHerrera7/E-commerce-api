import {
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../roles.enum';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Generar categorias' })
  @Post('seeder')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  seeder() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new NotFoundException();
    }
    return this.categoriesService.seeder();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener las categorias' })
  getcategories(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.categoriesService.getcategories(page ?? 1, limit ?? 20);
  }
}
