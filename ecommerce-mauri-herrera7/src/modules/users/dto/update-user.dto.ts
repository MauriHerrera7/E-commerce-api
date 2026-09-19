import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

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
  @IsString()
  @Matches(/^\+?[0-9]{7,20}$/)
  phone?: string;

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
