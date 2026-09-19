import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from 'src/modules/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginRateLimitGuard } from '../../common/guards/login-rate-limit.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, LoginRateLimitGuard],
})
export class AuthModule {}
