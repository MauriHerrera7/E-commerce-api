import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginDto } from 'src/modules/users/dto/create-user.dto';
import { Users } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private  usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}


  async register(user: CreateUserDto): Promise<Users> {
    const { confirmPassword, ...userWithoutPassword } = user;
    const findUser = await this.usersRepository.findOneBy({
      email: user.email,
    });

    if (findUser) {
      throw new BadRequestException('USUARIO YA REGISTRADO');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createUser: Users = this.usersRepository.create({
      ...userWithoutPassword,
      password: hashedPassword,
    });

    const newUser = await this.usersRepository.save(createUser);

    return newUser;
  }

  async signIn(credentials: LoginDto) {
    const findUser: Users | null = await  this.usersRepository.findOneBy({
        email: credentials.email,
    });

    if (!findUser) throw new BadRequestException('USUARIO NO ENCONTRADO');

    const matchingPassword = await bcrypt.compare(
        credentials.password,
        findUser.password,
    );

    if(!matchingPassword) throw new BadRequestException('CONTRASEÑA INCORRECTA');

const payload = {
  id: findUser.id,
  email: findUser.email,
  isAdmin: findUser.isAdmin,
};


    const token = this.jwtService.sign(payload);
    
     return { token };
  }
}
