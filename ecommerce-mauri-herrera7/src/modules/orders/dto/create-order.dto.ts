import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'e25479b9-26b3-43c3-936a-518500f0f44e' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description:
      'Items del pedido. El usuario se obtiene exclusivamente del JWT.',
    example: [
      { productId: 'e25479b9-26b3-43c3-936a-518500f0f44e', quantity: 2 },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
