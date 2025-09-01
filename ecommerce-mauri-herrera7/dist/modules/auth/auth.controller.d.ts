import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/modules/users/dto/create-user.dto';
import { CreateAndUpdateUserResponseDTO } from '../users/dto/response-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(credentials: LoginDto): Promise<{
        token: string;
        message: string;
    }>;
    register(user: CreateUserDto): Promise<CreateAndUpdateUserResponseDTO>;
}
