import { CreateUserDto, LoginDto } from 'src/modules/users/dto/create-user.dto';
import { Users } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<Users>, jwtService: JwtService);
    register(user: CreateUserDto): Promise<Users>;
    signIn(credentials: LoginDto): Promise<{
        token: string;
    }>;
}
