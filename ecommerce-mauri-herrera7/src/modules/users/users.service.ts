import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(page: number, limit: number):Promise<PaginatedUsersDTO> {
    const Allusers = await this.usersRepository.find();

    const start = (page - 1) * limit;
    const end = start + limit;

   const users = Allusers.slice(start, end);
    
   if (!users) {
      throw new NotFoundException('NO HAY USUARIOS REGISTRADOS');
    }

    return {
    data: users,
    total: Allusers.length,
    page,
    limit,
    totalPages: Math.ceil(Allusers.length / limit),
  };

  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!user){
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }
    return {
      message: 'USUARIO ENCONTRADO',
      user,
    }
  }

  async delete(id: string) {
    const userToDelete = await this.usersRepository.findOneBy({ id });

    if (!userToDelete) {
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }

    await this.usersRepository.delete(id);

    return {
      message: 'USUARIO ELIMINADO CORRECTAMENTE',
      user: userToDelete,
    };
  }

  async update(id: string, userData: Partial<Users>): Promise<CreateAndUpdateUserResponseDTO> {
    await this.usersRepository.update(id, userData);

    const updatedUser = await this.usersRepository.findOne(
      {where: { id },
  select: ['id', 'name', 'email', 'phone', 'country', 'city', 'address', ]})

    if (!updatedUser) {
      throw new NotFoundException('USUARIO NO ENCONTRADO');
    }

    return {
      success: 'USUARIO ACTUALIZADO CORRECTAMENTE',
      data: updatedUser,
    };
  }
 save(id:string ){
  return this.usersRepository.update(id, {isAdmin: true});
}
  
}
