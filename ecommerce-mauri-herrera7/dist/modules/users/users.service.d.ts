import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateAndUpdateUserResponseDTO } from './dto/response-user.dto';
import { PaginatedUsersDTO } from './dto/paginated-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<Users>);
    findAll(page: number, limit: number): Promise<PaginatedUsersDTO>;
    findById(id: string): Promise<{
        message: string;
        user: Users;
    }>;
    delete(id: string): Promise<{
        message: string;
        user: Users;
    }>;
    update(id: string, userData: Partial<Users>): Promise<CreateAndUpdateUserResponseDTO>;
    save(id: string): Promise<import("typeorm").UpdateResult>;
}
