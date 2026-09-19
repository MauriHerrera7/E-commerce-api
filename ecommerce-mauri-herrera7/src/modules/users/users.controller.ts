import {
  ForbiddenException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@UseInterceptors(ExcludePasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los usuarios (solo para administradores)',
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.usersService.findAll(page ?? 1, limit ?? 20);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener los usuarios por id (solo para administradores)',
  })
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() user: UpdateUserDto,
  ) {
    if (!currentUser.isAdmin && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, user);
  }
}
