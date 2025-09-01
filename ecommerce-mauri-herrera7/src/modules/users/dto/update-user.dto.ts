
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  
  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'Batman@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Bruce Wayne',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Dirección física del usuario',
    example: 'Batman 123',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de contacto',
    example: '123456789',
  })
  @IsOptional()
  @IsNumber()
  phone: number;

  @ApiPropertyOptional({
    description: 'País de residencia',
    example: 'Argentina',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Ciudad donde vive el usuario',
    example: 'Gotham city',
  })
  @IsOptional()
  @IsString()
  city?: string;


  
}
