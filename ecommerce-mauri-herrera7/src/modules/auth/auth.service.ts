import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto): Promise<Users> {
    const userWithoutPassword = {
      email: user.email,
      name: user.name,
      address: user.address,
      phone: user.phone,
      country: user.country,
      city: user.city,
    };
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
    const findUser: Users | null = await this.usersRepository.findOne({
      where: { email: credentials.email },
      select: ['id', 'email', 'name', 'password', 'isAdmin'],
    });

    if (!findUser) throw new UnauthorizedException('Invalid email or password');

    const matchingPassword = await bcrypt.compare(
      credentials.password,
      findUser.password,
    );

    if (!matchingPassword)
      throw new UnauthorizedException('Invalid email or password');

    const payload = {
      id: findUser.id,
      email: findUser.email,
      isAdmin: findUser.isAdmin,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: findUser.id,
        email: findUser.email,
        name: findUser.name,
        isAdmin: findUser.isAdmin,
      },
    };
  }
}
