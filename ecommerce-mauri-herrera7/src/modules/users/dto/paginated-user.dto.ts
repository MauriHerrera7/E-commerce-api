import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { Users } from "../entities/user.entity";

export class PaginatedUsersDTO {
  @IsNotEmpty()
  @IsArray()
  data: Users[];

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  totalPages: number;
}