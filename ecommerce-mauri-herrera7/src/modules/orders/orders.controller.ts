import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createOrderDto: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.ordersService.create(user.id, createOrderDto, idempotencyKey);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener el detalle de un pedido' })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.findOne(id, user);
  }
}
