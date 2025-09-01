import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/modules/users/dto/create-user.dto';
import { ExcludePasswordInterceptor } from 'src/interceptors/exclude-password.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAndUpdateUserResponseDTO } from '../users/dto/response-user.dto';

@Controller('auth')
@UseInterceptors(ExcludePasswordInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
@ApiOperation({ summary: 'Logea a un usuario' })
async signIn(@Body() credentials: LoginDto) {
  const result = await this.authService.signIn(credentials);

  return {
    message: 'USUARIO LOGEADO CORRECTAMENTE',
    ...result,
  };
}

  @Post('/register')
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Regista un nuevo usuario' })
  async register(@Body() user: CreateUserDto):Promise<CreateAndUpdateUserResponseDTO> {
    const Newuser= await this.authService.register(user);
    return{
      success: 'USUARIO REGISTRADO CON ÉXITO',
      data: Newuser,
    }
  }   
}
