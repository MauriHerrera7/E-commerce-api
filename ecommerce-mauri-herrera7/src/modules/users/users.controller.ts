import {Body, Controller,Delete,Get,Param,ParseUUIDPipe,Put,Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';


@UseInterceptors(ExcludePasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo para administradores)' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()  
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    if (limit&& page) {
      return this.usersService.findAll(+page, +limit);
    }
    return this.usersService.findAll(1,5);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener los usuarios por id (solo para administradores)' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id') 
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar usuario (solo para administradores)' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
  
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario' })
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto ) {
    return this.usersService.update(id, user);
  }
  @Put('updateadmin/:id')
  updateadmin(@Param('id', ParseUUIDPipe) id: string ) {
    return this.usersService.save(id);
  }
}
