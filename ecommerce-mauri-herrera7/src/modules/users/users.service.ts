import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateAndUpdateUserResponseDTO } from './dto/response-user.dto';
import { PaginatedUsersDTO } from './dto/paginated-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll(page: number, limit: number): Promise<PaginatedUsersDTO> {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'page must be positive and limit must be between 1 and 100',
      );
    }
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { email: 'ASC' },
    });

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { orders: true },
    });
    if (!user) {
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }
    return { message: 'USUARIO ENCONTRADO', user };
  }

  async delete(id: string) {
    const userToDelete = await this.usersRepository.findOneBy({ id });

    if (!userToDelete) {
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }

    await this.usersRepository.softDelete(id);

    return {
      message: 'USUARIO ELIMINADO CORRECTAMENTE',
    };
  }

  async update(
    id: string,
    userData: Partial<Users>,
  ): Promise<CreateAndUpdateUserResponseDTO> {
    if (userData.email) {
      const existing = await this.usersRepository.findOneBy({
        email: userData.email,
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('EMAIL ALREADY IN USE');
      }
    }
    await this.usersRepository.update(id, userData);

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'country', 'city', 'address'],
    });

    if (!updatedUser) {
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }

    return {
      success: 'USUARIO ACTUALIZADO CORRECTAMENTE',
      data: updatedUser,
    };
  }
}
