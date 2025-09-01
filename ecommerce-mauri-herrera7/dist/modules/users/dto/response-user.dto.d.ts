export declare class UserResponseDTO {
    id: string;
    name: string;
    email: string;
    phone: number;
    country?: string;
    city?: string;
    address: string;
}
export declare class CreateAndUpdateUserResponseDTO {
    success: string;
    data: UserResponseDTO;
}
