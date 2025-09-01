import { ApiProperty} from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsNumber } from 'class-validator';


export class UpdateProductsDto {
  @ApiProperty({ example: 'iPhone 15 Pro', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Nuevo modelo 2025', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}    