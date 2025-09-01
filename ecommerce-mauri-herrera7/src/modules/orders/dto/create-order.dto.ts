import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { Products } from "src/modules/products/entities/products.entity";

export class CreateOrderDto {
  
 
  @ApiProperty({
    description: 'Debe ser un UUID, no puede estar vacio',
    example: 'e25479b9-26b3-43c3-936a-518500f0f44e',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

   @ApiProperty({
    description: 'Debe ser un arreglo con al menos un producto',
    example: [{id: 'e25479b9-26b3-43c3-936a-518500f0f44e',},],
  })
  @IsArray()
  @ArrayNotEmpty()
  products: Partial<Products[]>;

}
