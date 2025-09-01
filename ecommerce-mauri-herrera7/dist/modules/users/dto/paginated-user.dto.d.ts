import { Users } from "../entities/user.entity";
export declare class PaginatedUsersDTO {
    data: Users[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
