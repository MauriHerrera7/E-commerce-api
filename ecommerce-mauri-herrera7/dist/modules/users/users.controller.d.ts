import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page: string, limit: string): Promise<import("./dto/paginated-user.dto").PaginatedUsersDTO>;
    findById(id: string): Promise<{
        message: string;
        user: import("./entities/user.entity").Users;
    }>;
    delete(id: string): Promise<{
        message: string;
        user: import("./entities/user.entity").Users;
    }>;
    update(id: string, user: UpdateUserDto): Promise<import("./dto/response-user.dto").CreateAndUpdateUserResponseDTO>;
    updateadmin(id: string): Promise<import("typeorm").UpdateResult>;
}
