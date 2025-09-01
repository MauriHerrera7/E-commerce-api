export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    address: string;
    phone: number;
    country?: string;
    city?: string;
    isAdmin?: boolean;
}
declare const LoginDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "email" | "password">>;
export declare class LoginDto extends LoginDto_base {
}
export {};
